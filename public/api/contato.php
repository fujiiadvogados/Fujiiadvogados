<?php

declare(strict_types=1);

/*
 * Endpoint do formulário de contato — Fujii Advocacia & Consultoria Jurídica.
 *
 * Recebe JSON do site, valida, aplica proteções antispam/antiduplicidade e envia
 * por SMTP autenticado (caixa de e-mail da Hostinger).
 *
 * Credenciais NUNCA ficam neste arquivo nem no repositório: são lidas de
 * "fujii-contato.config.php", um nível ACIMA do public_html (ver DEPLOY-HOSTINGER.md),
 * ou do caminho indicado na variável de ambiente FUJII_CONTATO_CONFIG.
 *
 * Nenhum dado pessoal ou conteúdo de mensagem é gravado em log.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');

const AREAS = [
    'tributario' => 'Direito Tributário',
    'agronegocio' => 'Direito Agrário e do Agronegócio',
    'previdenciario' => 'Direito Previdenciário',
    'civil' => 'Direito Civil',
    'consumidor' => 'Direito do Consumidor',
    'trabalhista' => 'Direito do Trabalho',
];

const URGENCIES = [
    'normal' => 'Não, posso aguardar',
    'prioritaria' => 'Sim, tenho prazo próximo',
    'urgente' => 'Urgente: prazo em até 48 h',
];

const MAX_BODY_BYTES = 16384;
const MIN_FILL_MS = 3000;
const LIMITS = ['name' => 120, 'email' => 254, 'phone' => 30, 'message' => 2000];
const DUPLICATE_WINDOW_S = 86400;
const SMTP_TIMEOUT_S = 15;

final class SmtpException extends RuntimeException
{
    public string $stage;

    public function __construct(string $stage, int $code = 0)
    {
        parent::__construct('smtp_' . $stage, $code);
        $this->stage = $stage;
    }
}

/** @param array<string, mixed> $extra */
function respond(int $status, string $code, string $message, array $extra = []): void
{
    http_response_code($status);
    echo json_encode(
        ['ok' => $status >= 200 && $status < 300, 'code' => $code, 'message' => $message] + $extra,
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

/** @return array<string, mixed>|null */
function load_config(): ?array
{
    $candidates = array_filter([
        getenv('FUJII_CONTATO_CONFIG') ?: null,
        dirname(__DIR__, 2) . '/fujii-contato.config.php',
    ]);
    foreach ($candidates as $path) {
        if (is_file($path) && is_readable($path)) {
            $config = require $path;
            return is_array($config) ? $config : null;
        }
    }
    return null;
}

/** @param array<string, mixed> $config */
function config_is_complete(array $config): bool
{
    foreach (['smtp_host', 'smtp_user', 'smtp_pass', 'to_email'] as $key) {
        if (!isset($config[$key]) || !is_string($config[$key]) || trim($config[$key]) === '') {
            return false;
        }
    }
    return filter_var($config['to_email'], FILTER_VALIDATE_EMAIL) !== false;
}

function clean_line(mixed $value): string
{
    if (!is_string($value)) {
        return '';
    }
    // Remove controles (inclui CR/LF: evita injeção de cabeçalhos) e normaliza espaços
    $value = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value) ?? '';
    return trim(preg_replace('/\s+/u', ' ', $value) ?? '');
}

function clean_text(mixed $value): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace('/[\x00-\x08\x0B-\x1F\x7F]+/u', '', $value) ?? '';
    return trim($value);
}

/**
 * @param array<string, mixed> $input
 * @return array{0: array<string, string>, 1: array<string, string>}
 */
function validate(array $input): array
{
    $data = [
        'name' => clean_line($input['name'] ?? ''),
        'email' => clean_line($input['email'] ?? ''),
        'phone' => clean_line($input['phone'] ?? ''),
        'area' => clean_line($input['area'] ?? ''),
        'urgency' => clean_line($input['urgency'] ?? 'normal'),
        'message' => clean_text($input['message'] ?? ''),
    ];
    $errors = [];

    $nameLen = mb_strlen($data['name']);
    if ($nameLen < 2 || $nameLen > LIMITS['name']) {
        $errors['name'] = 'Informe seu nome completo (2 a 120 caracteres).';
    }
    if (mb_strlen($data['email']) > LIMITS['email'] || filter_var($data['email'], FILTER_VALIDATE_EMAIL) === false) {
        $errors['email'] = 'Informe um e-mail válido.';
    }
    $digits = preg_replace('/\D+/', '', $data['phone']) ?? '';
    if (
        mb_strlen($data['phone']) > LIMITS['phone']
        || !preg_match('/^[0-9+()\-. ]*$/', $data['phone'])
        || strlen($digits) < 10
        || strlen($digits) > 13
    ) {
        $errors['phone'] = 'Informe um telefone com DDD (10 a 13 dígitos).';
    }
    if (!array_key_exists($data['area'], AREAS)) {
        $errors['area'] = 'Selecione uma das áreas de atuação.';
    }
    if (!array_key_exists($data['urgency'], URGENCIES)) {
        $data['urgency'] = 'normal';
    }
    $msgLen = mb_strlen($data['message']);
    if ($msgLen < 10 || $msgLen > LIMITS['message']) {
        $errors['message'] = 'Descreva sua demanda (10 a 2.000 caracteres).';
    }
    return [$data, $errors];
}

function storage_dir(array $config): string
{
    $dir = is_string($config['storage_dir'] ?? null) && $config['storage_dir'] !== ''
        ? $config['storage_dir']
        : dirname(__DIR__, 2) . '/fujii-contato-data';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        throw new RuntimeException('storage_unavailable');
    }
    return $dir;
}

/**
 * Limite de envios por IP e global, em janela deslizante de 1 hora.
 * O IP é guardado apenas como hash com "salt" (não é dado legível).
 * Com $record = false apenas verifica; o registro é feito só após um envio entregue,
 * para que falhas do servidor de e-mail não bloqueiem novas tentativas do visitante.
 */
function rate_limited(string $dir, array $config, bool $record): ?int
{
    $perIp = (int) ($config['max_per_ip_per_hour'] ?? 5);
    $global = (int) ($config['max_global_per_hour'] ?? 40);
    $salt = (string) ($config['hash_salt'] ?? $config['smtp_pass']);
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $now = time();

    $buckets = [
        ['file' => $dir . '/rate-' . hash('sha256', $salt . '|' . $ip) . '.json', 'max' => $perIp],
        ['file' => $dir . '/rate-global.json', 'max' => $global],
    ];
    $handles = [];
    $retryAfter = null;
    foreach ($buckets as $i => $bucket) {
        $fh = fopen($bucket['file'], 'c+');
        if ($fh === false) {
            throw new RuntimeException('storage_unavailable');
        }
        flock($fh, LOCK_EX);
        $raw = stream_get_contents($fh);
        $stamps = array_values(array_filter(
            is_string($raw) && $raw !== '' ? (json_decode($raw, true) ?: []) : [],
            static fn ($t): bool => is_int($t) && $t > $now - 3600
        ));
        if (count($stamps) >= $bucket['max']) {
            $retryAfter = max($retryAfter ?? 0, $stamps[0] + 3600 - $now);
        }
        $handles[$i] = [$fh, $stamps];
    }
    foreach ($handles as [$fh, $stamps]) {
        if ($record && $retryAfter === null) {
            $stamps[] = $now;
        }
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($stamps));
        flock($fh, LOCK_UN);
        fclose($fh);
    }
    return $retryAfter;
}

function marker_path(string $dir, string $kind, string $value): string
{
    return $dir . '/' . $kind . '-' . hash('sha256', $value);
}

function recently_sent(string $path): bool
{
    return is_file($path) && filemtime($path) > time() - DUPLICATE_WINDOW_S;
}

function cleanup(string $dir): void
{
    if (random_int(1, 50) !== 1) {
        return;
    }
    foreach (glob($dir . '/{sent,content,lock,rate}-*', GLOB_BRACE) ?: [] as $file) {
        if (is_file($file) && filemtime($file) < time() - 2 * DUPLICATE_WINDOW_S) {
            @unlink($file);
        }
    }
}

function mime_header(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/** @param array<string, string> $data */
function build_message(array $data, array $config, string $from, string $to): string
{
    $area = AREAS[$data['area']];
    $tz = new DateTimeZone('America/Cuiaba');
    $now = new DateTimeImmutable('now', $tz);
    $domain = substr(strrchr($from, '@') ?: '@localhost', 1);

    $body = implode("\n", [
        'Nova mensagem enviada pelo formulário de contato do site.',
        '',
        'Nome: ' . $data['name'],
        'E-mail: ' . $data['email'],
        'Telefone/WhatsApp: ' . $data['phone'],
        'Área de interesse: ' . $area,
        'Urgência: ' . URGENCIES[$data['urgency']],
        '',
        'Mensagem:',
        $data['message'],
        '',
        '—',
        'Recebido em ' . $now->format('d/m/Y H:i') . ' (horário de Cuiabá).',
        'Use "Responder" para escrever diretamente ao e-mail informado pelo visitante.',
    ]);

    $fromName = (string) ($config['from_name'] ?? 'Site Fujii Advocacia');
    $headers = [
        'Date: ' . $now->format(DATE_RFC2822),
        'From: ' . mime_header($fromName) . ' <' . $from . '>',
        'To: <' . $to . '>',
        'Reply-To: ' . mime_header($data['name']) . ' <' . $data['email'] . '>',
        'Subject: ' . mime_header('Contato pelo site — ' . $area),
        'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . $domain . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'X-Mailer: fujii-site-contato',
    ];
    return implode("\r\n", $headers) . "\r\n\r\n" . rtrim(chunk_split(base64_encode($body), 76, "\r\n"));
}

/** @param resource $fp */
function smtp_read($fp, string $stage): int
{
    $code = 0;
    while (true) {
        $line = fgets($fp, 2048);
        if ($line === false) {
            throw new SmtpException($stage);
        }
        $code = (int) substr($line, 0, 3);
        if (strlen($line) < 4 || $line[3] !== '-') {
            return $code;
        }
    }
}

/**
 * @param resource $fp
 * @param int[] $expected
 */
function smtp_cmd($fp, ?string $command, array $expected, string $stage): void
{
    if ($command !== null && fwrite($fp, $command . "\r\n") === false) {
        throw new SmtpException($stage);
    }
    $code = smtp_read($fp, $stage);
    if (!in_array($code, $expected, true)) {
        throw new SmtpException($stage, $code);
    }
}

function smtp_send(array $config, string $from, string $to, string $message): void
{
    $host = (string) $config['smtp_host'];
    $port = (int) ($config['smtp_port'] ?? 465);
    $secure = (string) ($config['smtp_secure'] ?? 'ssl');
    if ($secure === 'none' && empty($config['allow_insecure_smtp'])) {
        throw new SmtpException('config');
    }
    $context = stream_context_create(['ssl' => [
        'verify_peer' => true,
        'verify_peer_name' => true,
        'peer_name' => $host,
    ]]);
    $scheme = $secure === 'ssl' ? 'ssl://' : 'tcp://';
    $fp = @stream_socket_client($scheme . $host . ':' . $port, $errno, $errstr, SMTP_TIMEOUT_S, STREAM_CLIENT_CONNECT, $context);
    if ($fp === false) {
        throw new SmtpException('connect', (int) $errno);
    }
    stream_set_timeout($fp, SMTP_TIMEOUT_S);
    $ehlo = 'EHLO ' . (substr(strrchr($from, '@') ?: '@localhost', 1));
    try {
        smtp_cmd($fp, null, [220], 'greeting');
        smtp_cmd($fp, $ehlo, [250], 'ehlo');
        if ($secure === 'starttls') {
            smtp_cmd($fp, 'STARTTLS', [220], 'starttls');
            $methods = STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT
                | (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT') ? STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT : 0);
            if (stream_socket_enable_crypto($fp, true, $methods) !== true) {
                throw new SmtpException('starttls');
            }
            smtp_cmd($fp, $ehlo, [250], 'ehlo');
        }
        smtp_cmd($fp, 'AUTH LOGIN', [334], 'auth');
        smtp_cmd($fp, base64_encode((string) $config['smtp_user']), [334], 'auth');
        smtp_cmd($fp, base64_encode((string) $config['smtp_pass']), [235], 'auth');
        smtp_cmd($fp, 'MAIL FROM:<' . $from . '>', [250], 'mail_from');
        smtp_cmd($fp, 'RCPT TO:<' . $to . '>', [250, 251], 'rcpt_to');
        smtp_cmd($fp, 'DATA', [354], 'data');
        // "dot-stuffing" (RFC 5321 §4.5.2) e término com <CRLF>.<CRLF>
        $payload = preg_replace('/^\./m', '..', $message) ?? $message;
        smtp_cmd($fp, $payload . "\r\n.", [250], 'data_end');
        try {
            smtp_cmd($fp, 'QUIT', [221], 'quit');
        } catch (SmtpException $ignored) {
            // A mensagem já foi aceita (250 após DATA); falha no QUIT não invalida o envio.
        }
    } finally {
        fclose($fp);
    }
}

// ---------------------------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'method_not_allowed', 'Método não permitido.');
}

$config = load_config();
if ($config === null || !config_is_complete($config)) {
    error_log('contato: configuracao ausente ou incompleta');
    respond(503, 'not_configured', 'O envio pelo formulário está temporariamente indisponível.');
}

$allowedOrigins = array_values(array_filter((array) ($config['allowed_origins'] ?? []), 'is_string'));
$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($allowedOrigins !== [] && !in_array($origin, $allowedOrigins, true)) {
    respond(403, 'forbidden_origin', 'Origem não autorizada.');
}

if (stripos((string) ($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json') !== 0) {
    respond(415, 'unsupported_media_type', 'Formato de envio inválido.');
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY_BYTES) {
    respond(413, 'too_large', 'A mensagem excede o tamanho permitido.');
}
$raw = stream_get_contents(fopen('php://input', 'rb'), MAX_BODY_BYTES + 1);
if (!is_string($raw) || strlen($raw) > MAX_BODY_BYTES) {
    respond(413, 'too_large', 'A mensagem excede o tamanho permitido.');
}
$input = json_decode($raw, true);
if (!is_array($input)) {
    respond(400, 'bad_request', 'Não foi possível ler os dados enviados.');
}

// Honeypot: campo invisível para pessoas. Robôs que o preenchem recebem resposta neutra.
if (clean_line($input['website'] ?? '') !== '') {
    respond(200, 'sent', 'Mensagem enviada.');
}

$elapsed = $input['elapsed_ms'] ?? null;
if (!is_int($elapsed) || $elapsed < MIN_FILL_MS) {
    respond(422, 'too_fast', 'Aguarde alguns segundos e envie novamente.');
}

$requestId = (string) ($input['request_id'] ?? '');
if (!preg_match('/^[A-Za-z0-9-]{16,64}$/', $requestId)) {
    respond(400, 'bad_request', 'Não foi possível ler os dados enviados.');
}

[$data, $errors] = validate($input);
if ($errors !== []) {
    respond(422, 'invalid', 'Revise os campos indicados.', ['fields' => $errors]);
}

try {
    $dir = storage_dir($config);
} catch (RuntimeException $e) {
    error_log('contato: armazenamento indisponivel');
    respond(500, 'server_error', 'Não foi possível processar o envio agora.');
}
cleanup($dir);

// Envio repetido (duplo clique, reenvio após falha de rede, mesma mensagem colada de novo)
$sentMarker = marker_path($dir, 'sent', $requestId);
$contentMarker = marker_path($dir, 'content', mb_strtolower($data['email']) . '|' . $data['message']);
if (recently_sent($sentMarker) || recently_sent($contentMarker)) {
    respond(200, 'duplicate', 'Esta mensagem já havia sido recebida.');
}

$lock = fopen(marker_path($dir, 'lock', $requestId), 'c');
if ($lock === false || !flock($lock, LOCK_EX | LOCK_NB)) {
    respond(409, 'in_progress', 'Seu envio já está em processamento.');
}

$retryAfter = rate_limited($dir, $config, false);
if ($retryAfter !== null) {
    header('Retry-After: ' . $retryAfter);
    respond(429, 'rate_limited', 'Muitas tentativas em pouco tempo. Tente novamente mais tarde ou fale pelo WhatsApp.');
}

$from = (string) ($config['from_email'] ?? $config['smtp_user']);
$to = (string) $config['to_email'];
try {
    smtp_send($config, $from, $to, build_message($data, $config, $from, $to));
} catch (SmtpException $e) {
    // Somente etapa e código numérico: nenhum dado do visitante vai para o log.
    error_log('contato: falha smtp etapa=' . $e->stage . ' codigo=' . $e->getCode());
    respond(502, 'send_failed', 'Não foi possível enviar sua mensagem agora.');
}

rate_limited($dir, $config, true);
touch($sentMarker);
touch($contentMarker);
flock($lock, LOCK_UN);
fclose($lock);

respond(200, 'sent', 'Mensagem enviada.');

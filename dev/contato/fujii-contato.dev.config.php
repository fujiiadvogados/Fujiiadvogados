<?php

/*
 * SOMENTE DESENVOLVIMENTO LOCAL (docker-compose.dev.yml).
 * Envia para o Mailpit (servidor de e-mail de teste: http://localhost:8025),
 * que aceita qualquer usuário/senha. NÃO contém credenciais reais e NÃO é usado em produção.
 * A configuração de produção segue deploy/fujii-contato.config.example.php.
 */

return [
    'smtp_host' => 'mailpit',
    'smtp_port' => 1025,
    'smtp_secure' => 'none',
    'allow_insecure_smtp' => true, // aceito apenas aqui (rede interna do Docker)
    'smtp_user' => 'site@fujii-dev.test',
    'smtp_pass' => 'mailpit-aceita-qualquer-senha',
    'from_email' => 'site@fujii-dev.test',
    'from_name' => 'Site Fujii (desenvolvimento)',
    'to_email' => 'caixa-de-teste@fujii-dev.test',
    // Origens do servidor do Vite em desenvolvimento
    'allowed_origins' => [
        'http://localhost:8080',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:5173',
    ],
    'max_per_ip_per_hour' => 5,
    'max_global_per_hour' => 40,
    'storage_dir' => '/tmp/fujii-contato-data',
];

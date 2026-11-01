<?php

/*
 * MODELO — configuração do envio do formulário de contato.
 *
 * 1. Copie este arquivo para FORA do public_html, com o nome exato
 *    "fujii-contato.config.php" (na Hostinger: a pasta que CONTÉM o public_html,
 *    ex.: /home/uXXXXXXX/domains/fujiiadvogados.com.br/fujii-contato.config.php).
 * 2. Preencha a senha da caixa de e-mail. NUNCA faça commit do arquivo real.
 * 3. Permissão recomendada: 600.
 */

return [
    // Servidor SMTP da Hostinger (SSL implícito na porta 465)
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_port' => 465,
    'smtp_secure' => 'ssl', // 'ssl' (465) ou 'starttls' (587)

    // Caixa que autentica e envia. Na Hostinger, o remetente precisa ser a própria caixa.
    'smtp_user' => 'atendimento@fujiiadvogados.com.br',
    'smtp_pass' => 'PREENCHER_NO_SERVIDOR',
    'from_email' => 'atendimento@fujiiadvogados.com.br',
    'from_name' => 'Site Fujii Advocacia',

    // Destinatário oficial (o mesmo e-mail exibido no site)
    'to_email' => 'atendimento@fujiiadvogados.com.br',

    // Só aceita envios vindos do próprio site
    'allowed_origins' => [
        'https://fujiiadvogados.com.br',
        'https://www.fujiiadvogados.com.br',
    ],

    // Limites antiabuso (janela de 1 hora)
    'max_per_ip_per_hour' => 5,
    'max_global_per_hour' => 40,

    // Pasta (fora do public_html) para controle de duplicidade e limites.
    // Padrão: "fujii-contato-data" ao lado deste arquivo.
    // 'storage_dir' => '/home/uXXXXXXX/domains/fujiiadvogados.com.br/fujii-contato-data',
];

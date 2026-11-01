# Manual de Instalação e Publicação — Fujii Advocacia & Consultoria Jurídica

Passo a passo para colocar o site no ar na Hostinger (plano mais barato),
sincronizado com o GitHub, no domínio `fujiiadvogados.com.br`.

---

## 0. Resumo das pastas (leia primeiro)

| Onde | Pasta | O que vai dentro |
|---|---|---|
| Seu computador | `Fujiiadvogados/` | o projeto inteiro (descompactado do zip) |
| Seu computador | `Fujiiadvogados/dist/client/` | **arquivos prontos do site**, gerados pelo `npm run build` |
| GitHub | raiz do repositório | o projeto inteiro **+** a pasta `public_html/` (cópia de `dist/client`) |
| Hostinger | `/public_html/` | conteúdo de `dist/client` (index.html, `assets/`, imagens, `.htaccess`) |

Regra de ouro: **o que está DENTRO de `dist/client` vai DENTRO de `public_html`**
(não copie a pasta `dist` inteira, nem crie `public_html/client`).

Estrutura final correta na Hostinger:

```text
public_html/
├── index.html
├── favicon.png
├── robots.txt
├── sitemap.xml
├── .htaccess
└── assets/
    ├── *.js
    ├── *.css
    └── *.jpg / *.png
```

---

## 1. Pré-requisitos

- Conta Hostinger (**Hospedagem Premium** — o plano mais barato com domínio grátis e SSL).
- Conta no GitHub (gratuita).
- Node.js 20+ (https://nodejs.org) e Git (https://git-scm.com) instalados.

---

## 2. Preparar o projeto no computador

1. Descompacte `Fujiiadvogados.zip` (ex.: em `C:\sites\Fujiiadvogados`).
2. Abra o terminal **dentro dessa pasta** e rode:

```bash
npm install
npm run build
node scripts/gen-static.mjs
```

O build cria `dist/client/` — é essa pasta que vira o site.

---

## 3. Criar o repositório no GitHub

1. GitHub → **New repository** → nome `fujiiadvogados` → **Private** → **Create**.
2. No terminal, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Site Fujii Advocacia & Consultoria Jurídica"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/fujiiadvogados.git
git push -u origin main
```

---

## 4. Gerar a pasta `public_html` no repositório

A hospedagem compartilhada serve arquivos estáticos, então o repositório precisa
conter a pasta já construída:

```bash
npm run build
node scripts/gen-static.mjs
rm -rf public_html
cp -r dist/client public_html
git add public_html -f
git commit -m "build: publicacao"
git push
```

No Windows (PowerShell), troque as duas linhas do meio por:

```powershell
Remove-Item -Recurse -Force public_html -ErrorAction SilentlyContinue
Copy-Item -Recurse dist\client public_html
```

Confira: o arquivo `public_html/index.html` deve existir.

---

## 5. Adicionar o `.htaccess`

Crie o arquivo `public_html/.htaccess` (no projeto, antes do push) com:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

Sem ele, páginas como `/quem-somos` dão erro 404 ao recarregar.

---

## 6. Conectar o GitHub na Hostinger

1. hPanel → **Sites** → seu site → **Avançado** → **GitHub**.
2. **Conectar conta GitHub** e autorizar.
3. Repositório: `fujiiadvogados` — Branch: `main`.
4. **Diretório de instalação**: `public_html`.
   - Se o painel pedir a pasta de origem do repositório, informe `public_html`.
5. **Criar** → primeira sincronização.
6. Copie a **Webhook URL** e cole em: GitHub → repositório → **Settings** →
   **Webhooks** → **Add webhook** → Content type `application/json` → **Add webhook**.

A partir daí, cada `git push` publica o site automaticamente.

---

## 7. Alternativa manual (sem GitHub)

1. hPanel → **Gerenciador de Arquivos** → abra `public_html`.
2. Apague os arquivos padrão (`default.php`, `index.html` de exemplo).
3. Selecione **o conteúdo** de `dist/client` e compacte em `site.zip`.
4. Upload do `site.zip` dentro de `public_html` → botão **Extrair** → apague o zip.

---

## 8. Domínio

1. hPanel → **Domínios**. Se registrado na Hostinger, já aparece.
2. Se estiver no Registro.br, aponte os nameservers para:
   - `ns1.dns-parking.com`
   - `ns2.dns-parking.com`
3. Propagação: de 1 a 24 horas.

---

## 9. SSL (HTTPS)

1. hPanel → **Segurança** → **SSL** → **Instalar SSL** (Let's Encrypt gratuito).
2. Ative **Forçar HTTPS**.
3. Teste `https://fujiiadvogados.com.br`.

---

## 10. E-mail profissional

1. hPanel → **E-mails** → **Contas de e-mail** → **Criar conta**.
2. Crie `atendimento@fujiiadvogados.com.br`.
3. Celular/Outlook: IMAP `imap.hostinger.com` porta 993 · SMTP `smtp.hostinger.com` porta 465.

---

## 10.1 Ativar o envio do formulário de contato

O formulário envia para `api/contato.php` (já incluído no `public_html` pelo build).
Esse script manda o e-mail por SMTP autenticado da própria caixa da Hostinger.
**A senha nunca vai para o repositório nem para o `public_html`.**

1. Confirme que o domínio está ativo e que a caixa `atendimento@fujiiadvogados.com.br`
   existe (item 10) e recebe e-mails.
2. hPanel → **Avançado** → **Configuração do PHP**: use PHP **8.0 ou superior**
   (extensões `mbstring` e `openssl` ativas — padrão na Hostinger).
3. No **Gerenciador de Arquivos**, abra a pasta que **contém** o `public_html`
   (ex.: `/home/uXXXXXXX/domains/fujiiadvogados.com.br/`).
4. Crie ali o arquivo `fujii-contato.config.php` copiando o modelo
   `deploy/fujii-contato.config.example.php` do repositório e preencha `smtp_pass`
   com a senha da caixa. Permissão: **600**.
5. Teste: envie o formulário do site com a palavra **TESTE** na mensagem e confira a
   chegada na caixa de entrada (e no spam).

Como saber o que aconteceu (respostas do `api/contato.php`):

| Situação | Resposta | O visitante vê |
|---|---|---|
| Enviado (servidor SMTP aceitou) | 200 `sent` | "Mensagem enviada" |
| Reenvio da mesma mensagem | 200 `duplicate` | "Mensagem enviada" (sem novo e-mail) |
| Campos inválidos | 422 `invalid` | erros nos campos |
| Muitas tentativas (5/h por IP, 40/h no total) | 429 | aviso + WhatsApp |
| Arquivo de configuração ausente | 503 `not_configured` | erro + alternativas (e-mail, telefone, WhatsApp) |
| Falha no SMTP (senha errada, servidor fora) | 502 `send_failed` | erro + alternativas |

O log de erros do PHP registra apenas a etapa e o código SMTP (ex.:
`contato: falha smtp etapa=auth codigo=535` = senha incorreta), nunca dados do visitante.

Observação: o formulário só funciona no domínio publicado na Hostinger. Na prévia do
Lovable (sem PHP) ele exibe a mensagem de erro com as alternativas de contato.

### Por que aparece "Não foi possível enviar pelo formulário"

O endpoint é **PHP** e só funciona onde há PHP: na hospedagem Hostinger e no ambiente
local abaixo. O servidor do Vite (`npm run dev`) e a prévia do Lovable **não executam PHP**:
antes desta correção, o Vite devolvia o próprio arquivo `contato.php` (código-fonte) e o
formulário mostrava a falha genérica. Agora, sem PHP, a rota responde um JSON 503
(`dev_no_php`) e o visitante vê a mensagem de indisponibilidade com WhatsApp, e-mail e telefone.

### Testar o formulário localmente (PHP + servidor de e-mail de teste)

```bash
docker compose -f docker-compose.dev.yml up -d        # Apache+PHP 8.2 (8088) e Mailpit (8025)
CONTACT_API_DEV_TARGET=http://localhost:8088 npx vite dev --port 5173
# PowerShell: $env:CONTACT_API_DEV_TARGET="http://localhost:8088"; npx vite dev --port 5173
```

Abra http://localhost:5173/#contato, envie e veja o e-mail em http://localhost:8025.
O arquivo `dev/contato/fujii-contato.dev.config.php` só serve para esse ambiente (sem senha real).

### O que falta preencher na hospedagem (por meio seguro, nunca no chat ou no Git)

No arquivo `fujii-contato.config.php`, fora do `public_html`:

| Chave | Valor | Quem fornece |
|---|---|---|
| `smtp_pass` | senha da caixa `atendimento@fujiiadvogados.com.br` | responsável pelo hPanel |
| `smtp_user` / `from_email` | a caixa que autentica (precisa existir) | idem |
| `to_email` | destinatário oficial (hoje: `atendimento@fujiiadvogados.com.br`) | escritório |
| `allowed_origins` | `https://fujiiadvogados.com.br` e `https://www.…` (ajustar se o domínio mudar) | idem |

Pré-requisitos: domínio registrado e apontado para a Hostinger, SSL ativo e a caixa de e-mail criada.

## 11. Checklist final

- [ ] `https://fujiiadvogados.com.br` abre com cadeado
- [ ] `www` redireciona para o domínio principal
- [ ] `/quem-somos`, `/etica`, `/blog` abrem ao recarregar (`.htaccess` ok)
- [ ] Botão do WhatsApp abre a conversa correta
- [ ] Formulário envia para `atendimento@fujiiadvogados.com.br` (item 10.1) e o e-mail de TESTE chega na caixa de entrada
- [ ] Mapa e botões "Ver no mapa"/"Como chegar" apontam para Rua Quatro, n° 53 — Altos do Cerrado, Cuiabá — MT (coordenadas -15.6048971, -55.9929694)
- [ ] `sitemap.xml` e `robots.txt` acessíveis
- [ ] Testado em celular, tablet, notebook e monitor grande

---

## 12. Atualizações futuras

```bash
git pull
# faça as alterações
npm run build
node scripts/gen-static.mjs
rm -rf public_html && cp -r dist/client public_html
git add . && git commit -m "atualizacao" && git push
```

O webhook publica sozinho em poucos segundos.

---

## 13. Publicação automática (GitHub Actions)

O arquivo `.github/workflows/build-publish.yml` faz o build e atualiza a pasta
`public_html` sozinho a cada push na `main`. Fluxo:

```bash
git add .
git commit -m "atualizacao"
git push origin main
```

Depois do push, acompanhe em **GitHub → Actions**. Quando terminar, o commit
`build: atualiza public_html` dispara o webhook da Hostinger. O `.htaccess`
(com os redirecionamentos 301 das áreas antigas) fica em `public/.htaccess`.

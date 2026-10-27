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

## 11. Checklist final

- [ ] `https://fujiiadvogados.com.br` abre com cadeado
- [ ] `www` redireciona para o domínio principal
- [ ] `/quem-somos`, `/etica`, `/blog` abrem ao recarregar (`.htaccess` ok)
- [ ] Botão do WhatsApp abre a conversa correta
- [ ] Formulário envia para `atendimento@fujiiadvogados.com.br`
- [ ] Mapa mostra Rua 4, n° 53 — Altos do Cerrado, Cuiabá — MT
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

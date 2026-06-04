# Guia de Deploy VPS — Deriva PWA

Este é o guia completo para subir o aplicativo **Deriva PWA** em uma VPS (Ubuntu/Debian) usando Nginx, PM2, PostgreSQL local e SSL grátis com DuckDNS + Certbot.

## 0. Informações Básicas
* **Porta do app:** 3002
* **Diretório alvo:** `/var/www/deriva-pwa`
* **Banco de dados:** `deriva_pwa`
* **Usuário do banco:** `deriva_user`
* **URL:** `https://SEU_SUBDOMINIO.duckdns.org` (troque `SEU_SUBDOMINIO` pelo nome que você escolher)

---

## 1. Configurar o DuckDNS (DNS Dinâmico)
Antes de mexer na VPS, garanta que os subdomínios já existem:
1. Acesse [DuckDNS.org](https://www.duckdns.org/) e faça login.
2. Crie dois subdomínios:
   - `derivalove` (para o App/PWA principal)
   - `comprarderiva` (para a Landing Page pública)
3. Aponte o IP de **ambos** os domínios para o IP da VPS (`69.62.93.200`).
4. Aguarde a propagação (geralmente poucos minutos).
5. Para testar, no seu terminal, rode `nslookup derivalove.duckdns.org` e `nslookup comprarderiva.duckdns.org`. Ambos devem retornar o IP da VPS.

---

## 2. Acesso à VPS
Abra seu terminal e faça SSH para o servidor usando o usuário root:
```bash
ssh root@69.62.93.200
```
> *(Sua chave SSH pública já está cadastrada na VPS.)*

---

## 3. Setup do Servidor e Dependências
Execute os comandos de instalação básicos (isso atualizará pacotes e instalará Git, Node.js 20 LTS, PostgreSQL, Nginx, Certbot e PM2).

Você pode rodar linha a linha para conferir eventuais falhas:
```bash
apt update && apt upgrade -y
apt install -y git nginx postgresql postgresql-contrib certbot python3-certbot-nginx curl wget

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

npm install -g pm2
```

---

## 4. Banco de Dados Local (PostgreSQL)
Acesse a linha de comando do PostgreSQL como superusuário `postgres`:
```bash
sudo -u postgres psql
```

Dentro do console do banco (`postgres=#`), copie e cole os comandos criando o banco e o usuário.
**IMPORTANTE: TROQUE `SENHA_FORTE_AQUI` PELA SENHA QUE ESCOLHER!**
```sql
CREATE DATABASE deriva_pwa;
CREATE USER deriva_user WITH ENCRYPTED PASSWORD 'SENHA_FORTE_AQUI';
GRANT ALL PRIVILEGES ON DATABASE deriva_pwa TO deriva_user;
ALTER DATABASE deriva_pwa OWNER TO deriva_user;
\c deriva_pwa
GRANT ALL ON SCHEMA public TO deriva_user;
\q
```

---

## 5. Clonar o Repositório do App
Crie a pasta web e clone o projeto usando sua chave SSH (se o root tiver chave autorizada no GitHub) ou a URL HTTPS. Como estamos logando de root e pode não haver chave privada no root, o melhor é HTTPS:
```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/leonardoalvesoop0987-hue/derivaapp.git deriva-pwa
cd deriva-pwa
```

---

## 6. Configurar as Variáveis de Ambiente (.env)
Copie o arquivo de exemplo fornecido no projeto:
```bash
cp .env.example .env
nano .env
```

**Preencha o arquivo corretamente:**
* Em `DATABASE_URL`, insira a mesma `SENHA_FORTE_AQUI` que você cadastrou no passo 4.
* Em `JWT_SECRET` e `SESSION_SECRET`, digite/gerada duas strings longas e aleatórias. Exemplo: `a3f8h1...`
* Em `NEXT_PUBLIC_APP_URL`, coloque sua URL real (ex: `https://SEU_SUBDOMINIO.duckdns.org`).
* Se for usar Cloudflare R2 depois, preencha os dados do R2. Se for usar upload local na pasta `public/uploads`, não precisa das flags R2 no momento dependendo de como a API foi desenhada (upload padrão vai pra local).
*(Salve com `Ctrl+O`, `Enter`, e feche com `Ctrl+X`)*.

---

## 7. Instalação e Build do Next.js
Instale as dependências, crie as tabelas, popule as cartas iniciais e compile a aplicação para produção:
```bash
npm install
npx prisma generate
npx prisma migrate deploy

# Popula o banco com os dados estáticos essenciais (baralhos)
npm run seed

# Build de produção do PWA
npm run build
```

---

## 8. Iniciar o App com PM2
O repositório já contém um `ecosystem.config.cjs` que roda o app isolado na porta `3002`.
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```
*(O `pm2 startup` exibirá um comando `sudo env PATH...` na tela. Copie-o e cole-o no terminal para rodar o app no boot do servidor)*.

---

## 9. Nginx (Proxy Reverso)
Ative o arquivo de configuração de Nginx que foi enviado junto no repositório.
**Antes de rodar**, edite o arquivo e substitua o subdomínio dummy pela sua URL do DuckDNS:
```bash
nano deploy/nginx/deriva-pwa.conf
```
*Troque `server_name SEU_SUBDOMINIO.duckdns.org;` pelo seu*.
*(Salve com `Ctrl+O`, `Enter`, e feche com `Ctrl+X`)*.

Ative o site no Nginx:
```bash
cp deploy/nginx/deriva-pwa.conf /etc/nginx/sites-available/deriva-pwa
ln -s /etc/nginx/sites-available/deriva-pwa /etc/nginx/sites-enabled/deriva-pwa

# Teste para erros de sintaxe (deve retornar syntax is ok e test is successful)
nginx -t

# Reinicie para aplicar
systemctl reload nginx
```

> **Aviso:** Execute `ls -la /etc/nginx/sites-enabled` para se certificar de que não gerou nomes duplicados ou de que este domínio não conflita com o outro projeto já em execução na VPS.

---

## 10. SSL com Certbot (HTTPS Ativo)
Rode o certbot indicando ao Nginx os dois domínios que ele deve proteger:
```bash
certbot --nginx -d derivalove.duckdns.org -d comprarderiva.duckdns.org
```
O Certbot pedirá um e-mail de contato e concordância com os termos. Ele injetará os certificados SSL automaticamente no `/etc/nginx/sites-available/deriva-pwa` para ambos os domínios e fará reload.

Teste se a auto-renovação de 90 dias funciona sem problemas:
```bash
certbot renew --dry-run
```

---

## 11. Regras de Firewall (Opcional, se o UFW estiver ativo)
Se você utiliza UFW na VPS (`ufw status`), assegure-se de que a porta web e o SSH fiquem liberados.
**CUIDADO: Se você rodar `ufw enable` antes de liberar o SSH, você será trancado fora do servidor!**
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
```

---

## 12. Checklist Pós-Deploy e Teste Manual
Abra seu celular ou computador na URL: `https://SEU_SUBDOMINIO.duckdns.org`.
Verifique se:
- [ ] O App abre perfeitamente via HTTPS com o cadeado fechado.
- [ ] Cadastro e Login funcionam normalmente.
- [ ] Na sessão, a primeira carta a sair é Azul.
- [ ] Acessar `/admin` está bloqueado/funcional apenas para a conta admin.
- [ ] Consegue fazer upload de um arquivo `.mp4` pequeno e reproduzir (os arquivos cairão em `/public/uploads` local).
- [ ] O menu do Chrome/Safari exibe a opção de "Instalar / Adicionar à Tela Inicial" (PWA válido).
- [ ] Service worker registra sem erros no Chrome DevTools > Application.

---

## 13. Segurança Mínima
- **NUNCA** commite o `.env` de produção de volta no repositório.
- A porta real `3002` do Next.js só está exposta internamente `127.0.0.1`. Todo o acesso externo entra filtrado pelo Nginx (porta 80/443).
- Proteja a senha do banco; os logs de aplicação no Nginx ficam em `/var/log/nginx/`.

---

## 14. Como Atualizar no Futuro
Sempre que você fizer novos `commits` no seu GitHub e quiser atualizar o servidor de produção, acesse a pasta e rode os passos:

```bash
cd /var/www/deriva-pwa

# Baixa alterações
git pull

# Se houver pacotes novos
npm install

# Se houver migrations novas (alterações no banco)
npx prisma migrate deploy

# Gera os tipos do Prisma atualizados (obrigatório)
npx prisma generate

# Reconstrói a aplicação otimizada para prod
npm run build

# Reinicia a instância sem downtime violento
pm2 restart deriva-pwa
```

### Rollback (Se quebrar a master)
Se a versão atual quebrar o servidor, volte rápido ao commit funcional anterior:
```bash
cd /var/www/deriva-pwa
git log --oneline -5
git checkout <ID_DO_COMMIT_ANTIGO>
npm install
npm run build
pm2 restart deriva-pwa
```
*(Nota: Rollbacks podem ser perigosos caso uma migration de BD destrutiva tenha ocorrido na transição. Evite `prisma migrate reset` em produção).*

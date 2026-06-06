# Deriva PWA - Orientação para Agentes IA (Codex, Antigravity, VS Code)

Este projeto é a versão Progressive Web App (PWA) do Deriva, uma experiência de cartas íntimas para casais.

## 1. Stack e Infraestrutura
- **Frontend/Backend:** Next.js 16.2.7 (App Router), TypeScript, TailwindCSS v4.
- **Banco de Dados:** PostgreSQL com Prisma (schema único em `prisma/schema.prisma`).
- **Deploy:** VPS via PM2 (app rodando em `deriva-pwa`), proxy via Nginx.
- **Integrações Sensíveis:** AWS S3, Cloudflare R2, ElevenLabs (TTS).

## 2. Mapa do Projeto
- `src/app/app/`: Frontend da área logada e rotas das sessões.
- `src/app/api/`: Rotas de backend (onde reside toda a lógica de segurança e negócio).
- `src/app/lp/`: Landing Page (não quebre ou altere a copy da LP sem permissão explícita).
- `src/app/admin/`: Painel de administração interno.
- `src/lib/deriva/session-engine.ts`: O motor central de sorteio, pesos e progressão de cartas. **NUNCA altere sem testes rigorosos.**
- `src/services/server/`: Serviços core de backend (ex: processamento de voz).
- `prisma/`: Definições de banco e seeds.
- `public/`: Assets estáticos.

## 3. Regras de Segurança e Escopo
1. **Escopo Fixo:** Trabalhe APENAS dentro de `FullMeet/deriva-pwa`. Não toque em diretórios irmãos.
2. **Secrets Intocáveis:** NUNCA leia, modifique, logue ou repasse os arquivos `.env`. As chaves de ElevenLabs, S3, ou DATABASE_URL são altamente confidenciais.
3. **Não Destruição:** Não execute comandos que limpam ou dão reset no banco de produção sem confirmação. O seed `npm run seed` pode ser destrutivo se não for bem avaliado.
4. **Deploy:** Não faça deploy sem autorização. Se for instruído a implantar, os comandos são sempre `git pull`, `npm install`, `npm run build` e `pm2 restart deriva-pwa`.
5. **Runtime Segura:** Não altere ou crie features sem entender que o sistema exige estabilidade máxima durante o uso do casal. Sem "quebras" durante a noite.

## 4. Ferramentas de Contexto
Se você precisa explorar o código antes de agir, use os índices configurados para não estourar tokens:
- `npm run context:rtk` -> Roda o Repomix (RTK) gerando arquivo unificado de código essencial.
- `npm run context:graph` -> Roda CodeGraph para mapas semânticos.
- Os ignores estão perfeitamente ajustados em `.rtkignore` e `.codegraphignore` para omitir mídia, dependências e chaves (secrets).

## 5. Pós-Mudanças
SEMPRE execute `npm run check:safe` (que faz lint e build) antes de dar a tarefa como finalizada, para garantir ausência de quebras de compilação.

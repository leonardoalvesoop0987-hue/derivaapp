# AI Context Map - Deriva PWA

Este arquivo descreve o que indexar (RTK / CodeGraph) para rápido entendimento da arquitetura do projeto, ignorando lixo.

## Rotas Principais
- `src/app`: Raiz do Next.js App Router (LP, Auth, e rotas filhas).
- `src/app/api`: Todos os endpoints REST da aplicação, integração com banco e serviços externos.

## Lógica e UI
- `src/components`: UI Components reutilizáveis (Tailwind/Radix/Motion).
- `src/lib`: Bibliotecas auxiliares, DB (Prisma client instance), utilitários e a **engine de sessões**.
- `src/services`: Camada de comunicação Server-to-Server e Server-to-External APIs (R2, AWS, ElevenLabs).

## Dados e Mídia
- `prisma`: Contém apenas `schema.prisma` e arquivos de migração.
- `scripts`: Workers em background, rotinas de setup e manutenção.
- `public`: Assets servidos pelo Node/Next (imagens, videos). Mídias pesadas aqui devem ser ignoradas.

## Comandos de Contexto
- Gerar pacote de código enxuto: `npm run context:rtk` (Saída: `repomix-output.xml`)
- Gerar grafo semântico do código: `npm run context:graph`
- O arquivo `.env` nunca será lido ou anexado graças às exclusões globais.

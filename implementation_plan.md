# UX & ElevenLabs Flow Fixes

O objetivo deste plano é resolver os quatro problemas apontados na página de sessão (`/app/sessao/[id]/page.tsx`) de forma direta, isolada e segura, sem afetar o backend principal (engine, deploy pipeline ou models não relacionados).

## Proposed Changes

### 1. Fix: Scroll interno da carta
O problema de scroll se deve à falta de propriedades CSS explícitas para toques e à interferência de eventos de toque no wrapper 3D.
- Adicionar `touch-action: pan-y` e `overscroll-behavior: contain` ao elemento `div` que renderiza o verso da carta e o texto.
- Garantir que a lógica de swipe (veja abaixo) não intercepte o gesto vertical, testando o `event.target` ou calculando rigorosamente o eixo dominante.

### 2. Fix: Ritmo/Intensidade
A interface de ajuste de ritmo ("Devagar / Assim / Acelerar") aparece iterativamente e polui a leitura da carta.
- **Mudança:** A variável/condicional automática que exibe o Pace Dial após 3 cartas será removida.
- **Nova UI:** Um botão sutil chamado "Ritmo" ou um ícone `Activity`/`Flame` será adicionado à Top Bar (ao lado do número da carta).
- **Interação:** Ao clicar neste botão, o Pace Dial aparece (toggle). O usuário decide quando quer alterar.

### 3. Fix: Swipe para a próxima carta
Atualmente, só se avança tocando no botão "Próxima".
- Adicionar listeners `onTouchStart` e `onTouchEnd` no wrapper principal da carta.
- **Regra:** Se `isFlipped` for verdadeiro e o gesto de swipe horizontal (`deltaX`) for dominante (exemplo: `Math.abs(deltaX) > 60` e `Math.abs(deltaX) > Math.abs(deltaY) * 1.5`), disparamos o `fetchNext("NEXT")` ou `fetchNext("SKIP")` dependendo da direção.
- Se o usuário arrastar para cima/baixo (`deltaY` dominante), ignorar e deixar o navegador fazer o scroll natural do texto.

### 4. Fix: Fluxo do Botão ElevenLabs (Narração Cacheada)
Atualmente o frontend não é reativo ao status real da geração e só tenta tocar chamando um POST indiscriminado. O `preloadSessionAudios` ocorre, mas o frontend não sabe quando o áudio fica pronto, resultando em loading ou botões escondidos.

- **Novo Endpoint:** Criar `GET /api/session/[id]/voice-status?cardId=[id]` que checa no banco de dados (`CardVoiceAudio`) qual é o status exato daquele hash/texto (`READY`, `GENERATING`, `ERROR`).
- **Comportamento Frontend (`page.tsx`):**
  - Ao virar a carta (`isFlipped`), se houver `session_short_text`, fazer fetch imediato deste status.
  - Se retornar `GENERATING` (o preload do backend ainda está trabalhando), mostrar `Preparando áudio` e fazer um "short poll" (ex: a cada 2s) até mudar.
  - Se retornar `READY`, mostrar botão `Ouvir carta` ou `Ouvir` com a URL já definida.
  - Ao clicar no botão, toca o áudio já cacheado diretamente no browser (`new Audio(data.audioUrl)`), sem fazer POST extra no botão (apenas para fallback).
  - Nunca cruzar/conflitar com o `<AudioPlayer>` ambiente.

## Verification Plan
### Manual Verification
- Acessar `/app/sessao/[id]`, abrir uma carta longa e usar o swipe (vertical para rolar texto, horizontal para avançar).
- Validar se o Ritmo sumiu do meio da tela e se funciona via botão de toggle.
- Conferir no Network se a sessão faz o request de `GET .../voice-status` apenas para saber do áudio ElevenLabs.
- Confirmar que o botão só reflete o áudio TTS (ElevenLabs).
- Rodar `npm run lint && npm run build` para checar falhas ou erros TS.

---

## User Review Required
> [!IMPORTANT]
> A implementação do swipe na web (`touch-action`) costuma conflitar com scrolls nativos se o iOS for rigoroso. A matemática proposta (`abs(deltaX) > abs(deltaY) * 1.5`) resolve isso em 99% dos casos mobile. Concorda com este formato de swipe dominante?
> A respeito do botão de ritmo ("Ritmo"), adicionar um botão simples no cabeçalho ou na Action Bar (rodapé) junto de "Próxima"? O cabeçalho parece ser o local mais adequado e menos acidental. Aprovado?

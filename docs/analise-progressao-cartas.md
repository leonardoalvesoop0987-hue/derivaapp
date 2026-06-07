# Análise da Progressão de Cartas - Deriva PWA

## 📊 Mapeamento de Cartas por Função Erógena

### AZUL (Preparação Inicial)
| Card | Título | Primary Tag | Intensity | Stage | Erotic Function |
|------|--------|-------------|-----------|-------|-----------------|
| 001 | Escolha do corpo | TOQUE_LEVE | LEVE | OPENING | PREPARO |
| 002 | Mãos lentas | TOQUE_LEVE | LEVE | OPENING | PREPARO |
| 003 | Mapa de calor | TOQUE_INTIMO | QUENTE | WARMUP | PROVOCACAO |
| 004 | Só pode provocar | PROIBICAO | QUENTE | TEASING | PROVOCACAO |
| 005 | Profissional e cliente | ROLEPLAY | QUENTE | TEASING | PROVOCACAO |
| 006 | Sem pressa, sem fala | CONEXAO | LEVE | WARMUP | PREPARO |

### ROSA (Prazer Manual/Oral - Sem Vídeo)
| Card | Título | Primary Tag | Intensity | Stage | Erotic Function | Receiver |
|------|--------|-------------|-----------|-------|-----------------|----------|
| 013 | Ela guia | COMANDO_DELA | INTENSO | BUILDUP | PRAZER_NELA | WOMAN |
| 014 | Controle dela | CONTROLE_DELA | INTENSO | BUILDUP | PRAZER_NELA | WOMAN |
| 015 | Boca e pausa | ORAL_NELA | INTENSO | BUILDUP | PRAZER_NELA | WOMAN |
| 016 | Ela por cima | CONTROLE_DELA | INTENSO | INTENSE | PRAZER_CASAL | WOMAN |
| 017 | Só o clímax importa | FOCO_NELA | INTENSO | INTENSE | PRAZER_NELA | WOMAN |
| 018 | Guia sem vergonha | COMANDO_DELA | INTENSO | TEASING | PROVOCACAO | WOMAN |
| 019 | Mãos obedientes | DOMINANCIA_LEVE | QUENTE | TEASING | PROVOCACAO | WOMAN |
| 020 | Ela escolhe a sequência | CONTROLE_DELA | INTENSO | BUILDUP | PRAZER_NELA | WOMAN |
| 021 | Vontade confessada | DIRTY_TALK | QUENTE | TEASING | PROVOCACAO | WOMAN |

### ROXO (Estímulo Visual + Ação - Com Vídeo)
| Card | Título | Primary Tag | Intensity | Stage | Erotic Function | Video Required |
|------|--------|-------------|-----------|-------|-----------------|-----------------|
| 022 | Tela para ela | VIDEO | INTENSO | INTENSE | VIDEO_ESTIMULO | ✅ |
| 023 | Tela para ele | VIDEO | INTENSO | INTENSE | VIDEO_ESTIMULO | ✅ |
| 024 | Sem tela, só boca | FOCO_NELA | INTENSO | BUILDUP | PRAZER_NELA | ❌ |
| 025 | Três vídeos, uma escolha | VIDEO | INTENSO | INTENSE | VIDEO_ESTIMULO | ✅ |
| 026 | Copiar só a energia | COPIAR_ENERGIA | INTENSO | INTENSE | PRAZER_CASAL | ✅ |
| 027 | Oral interrompido | PROVOCACAO | INTENSO | INTENSE | PROVOCACAO | ❌ |
| 028 | O receptor manda | COMANDO_DELA | INTENSO | BUILDUP | PRAZER_NELA | ❌ |

### VERMELHO (Penetração)
| Card | Título | Primary Tag | Intensity | Stage | Erotic Function |
|------|--------|-------------|-----------|-------|-----------------|
| 029 | Ritmo crescente | PENETRACAO | INTENSO | INTENSE | PRAZER_CASAL |
| 030 | Posição escolhida por ela | CONTROLE_DELA | INTENSO | INTENSE | PRAZER_CASAL |
| 031 | Forte, mas atento | PENETRACAO | PICO | PEAK | PICO |
| 032 | Sem trocar por 3 minutos | PENETRACAO | INTENSO | INTENSE | PRAZER_CASAL |
| 033 | Ela no comando do fim | FECHAMENTO | PICO | PEAK | PICO |
| 034 | Proibido penetrar | SEM_PENETRACAO | INTENSO | INTENSE | PROVOCACAO |
| 035 | Pico opcional | PICO | PICO | PEAK | PICO |

### PRETO (Fantasia e Dominância)
| Card | Título | Primary Tag | Intensity | Stage | Erotic Function |
|------|--------|-------------|-----------|-------|-----------------|
| 036 | Personagens sorteados | ROLEPLAY | INTENSO | INTENSE | FANTASIA |
| 037 | Mistério permitido | IMAGINACAO | PICO | PEAK | FANTASIA |
| 038 | Ordem sussurrada | DOMINANCIA_LEVE | INTENSO | INTENSE | PROVOCACAO |
| 039 | Cena de hotel | ROLEPLAY | INTENSO | INTENSE | FANTASIA |
| 040 | Profissional com deslize | ROLEPLAY | INTENSO | INTENSE | FANTASIA |
| 041 | Terceira presença imaginária | TERCEIRO_IMAGINARIO | PICO | PEAK | FANTASIA |
| 042 | Proibição mental | PROIBICAO | INTENSO | INTENSE | PROVOCACAO |

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### 1. **ORAL após PENETRAÇÃO é ilógico**
**Problema:** O algoritmo pode sortear uma carta ROSA com ORAL_NELA (Card 015) após uma carta VERMELHO com PENETRAÇÃO (Cards 029-032).

**Exemplo de sequência ruim:**
```
Card 029: Ritmo crescente (PENETRAÇÃO, INTENSE)
→ Card 015: Boca e pausa (ORAL_NELA, BUILDUP)  ❌ Volta para oral depois de já ter penetrado
```

**Por quê é ruim:** Depois de penetração, voltar para oral sem contato genital é um retrocesso lógico na progressão de intensidade.

### 2. **PRELIMINARES após ADVANCED é sem sentido**
**Problema:** O algoritmo pode sortear cartas AZUL (toque leve) após STAGE INTENSE/PEAK.

**Exemplo de sequência ruim:**
```
Card 031: Forte, mas atento (PENETRAÇÃO, PICO)
→ Card 001: Escolha do corpo (TOQUE_LEVE, OPENING)  ❌ Volta para massagem suave depois de pico
```

### 3. **SEM_PENETRAÇÃO no meio de PENETRAÇÃO**
**Problema:** Card 034 (Proibido penetrar) deveria vir ANTES de penetração para criar desejo, não no meio/depois.

**Exemplo de sequência ruim:**
```
Card 030: Posição escolhida por ela (PENETRAÇÃO, INTENSE)
→ Card 034: Proibido penetrar (SEM_PENETRAÇÃO, INTENSE)  ❌ Tira a penetração depois que já começou
```

### 4. **Falta de progressão lógica ROSA sem vídeo → ROXO com vídeo**
**Problema:** ROXO (com vídeo estimulo) é mais intenso e deveria ter prioridade para aparecer após ROSA manual.

---

## ✅ SOLUÇÕES PROPOSTAS

### Estratégia: Penalidades Inteligentes no Scoring

Modificar o arquivo `src/lib/deriva/session-engine.ts` para adicionar estas regras NO SCORING (não quebra o banco):

#### **Regra 1: Evitar ORAL após PENETRAÇÃO**
```
if (lastCard?.primary_tag === "PENETRACAO" && candidate.primary_tag === "ORAL_NELA") {
  score -= 999;  // Quase impossível de sortear
}
```

#### **Regra 2: Não retornar a AZUL após stage INTENSE/PEAK**
```
if (input.currentPosition > 3 && 
    (lastCard?.stage === "INTENSE" || lastCard?.stage === "PEAK") && 
    candidate.stage === "OPENING") {
  score -= 80;
}
```

#### **Regra 3: SEM_PENETRAÇÃO deveria vir ANTES de PENETRAÇÃO**
```
const hasPenetrationCard = sequenceSoFar.some(c => c.primary_tag === "PENETRACAO");
if (hasPenetrationCard && candidate.primary_tag === "SEM_PENETRAÇÃO") {
  score -= 100;  // Evita depois que já teve penetração
}
```

#### **Regra 4: Priorizar ROXO (com vídeo) após ROSA (manual)**
```
if (lastCard?.primary_tag === "COMANDO_DELA" || 
    lastCard?.primary_tag === "CONTROLE_DELA" || 
    lastCard?.primary_tag === "ORAL_NELA") {
  if (candidate.primary_tag === "VIDEO" && candidate.requires_video) {
    score += 40;  // Dá preferência para próximo passo com vídeo
  }
}
```

#### **Regra 5: Permitir ORAL com vídeo em qualquer momento (Card 022, 023)**
```
// Cartas ROXO com vídeo (022, 023, 025, 026) podem aparecer mesmo após penetração
// porque são mais intensas que preliminares
if (lastCard?.primary_tag === "PENETRACAO" && 
    candidate.requires_video && 
    candidate.primary_tag === "VIDEO") {
  score -= 0;  // Não penaliza, permite normalmente
}
```

#### **Regra 6: Evitar repetição de ROLE PLAY muito seguida**
```
const recentRolesCount = sequenceSoFar.slice(-3).filter(c => c.primary_tag === "ROLEPLAY").length;
if (recentRolesCount >= 2 && candidate.primary_tag === "ROLEPLAY") {
  score -= 50;
}
```

---

## 📐 Fluxo de Progressão Esperado (Ideal)

```
INÍCIO: AZUL (toque, massagem)
   ↓
TRANSIÇÃO: DERIVA (beijo, provocação)
   ↓
PRÉ-INTENSO: ROSA manual (boca, dedos, comando dela)
   ↓
INTENSO: ROXO com vídeo (vídeo + ação, mais estimulo visual)
   ↓
PICO: VERMELHO (penetração) ou PRETO (fantasia)
   ↓
FINALIZAÇÃO: PICO com fechamento
```

### Sequência aceitável alternativa:
```
AZUL → ROSA → VERMELHO (sem vídeo) → ROXO com vídeo → PRETO (fantasia)
```

### Sequência INACEITÁVEL:
```
VERMELHO (penetração) → AZUL (toque leve)  ❌
VERMELHO (penetração) → ROSA manual sem vídeo  ❌
SEM_PENETRAÇÃO → PENETRAÇÃO → SEM_PENETRAÇÃO  ❌
```

---

## 🔧 Implementação

As mudanças serão feitas em `src/lib/deriva/session-engine.ts`:
- Função `getNextCard()` - adicionar scoring ajustado
- Sem mudanças no banco de dados
- Sem mudança no texto das cartas
- Apenas lógica de sorteio mais inteligente


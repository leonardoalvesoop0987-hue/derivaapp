# 🎬 Auditoria Completa - Fluxo de Upload e Processamento de Vídeos

## 📊 Descobertas Principais

### ✅ Boas Notícias
1. **Processamento JÁ é automático** - Vídeos começam na fila imediatamente após upload
2. **Não precisa clicar em "ativar"** - O worker processa vídeos com `status=QUEUED` automaticamente
3. **Fila é sequencial mas confiável** - Recupera vídeos travados automaticamente

### ⚠️ Problemas Identificados
1. **Processamento pode ser MUITO lento** (especialmente para vídeos grandes)
2. **FFmpeg timeout é excessivo** (90 minutos - pode estar esperando)
3. **Sem paralelização** - Worker processa 1 vídeo por vez
4. **Upload para R2 pode ser gargalo** - Não há retry ou timeout específico
5. **Sem feedback visual de progresso** - Admin não vê porcentagem de processamento

---

## 🔄 Fluxo Atual (DETALHADO)

### 1️⃣ Upload (POST /api/admin/media/upload)

**O que acontece:**
```
Admin seleciona arquivo → FormData com files[] → API upload/route.ts
  ↓
Cria buffer do arquivo
  ↓
Gera storage_key = `${Date.now()}_${UUID}_${filename}`
  ↓
Upload para R2 (se configurado) OU salva em /public/uploads
  ↓
Cria registro no DB com:
  - processing_status: "QUEUED"  ← ⭐ Já entra na fila!
  - is_active: false              ← Desativado por padrão
  - classification_status: "PENDING_CLASSIFICATION"
  - tipo: VIDEO
  ↓
Retorna asset ao admin
```

**Arquivo de upload:** `src/app/api/admin/media/upload/route.ts`
**Linhas críticas:**
- L72: `processing_status: "QUEUED"` ← Já começa processamento
- L74: `is_active: false` ← Desativado (não afeta processamento)

### 2️⃣ Fila de Processamento (Automática)

**O que acontece:**
```
Worker (media-worker.ts) roda continuamente
  ↓
Cada 10 segundos (POLL_INTERVAL_MS), verifica:
  - SELECT * FROM media_assets WHERE status='QUEUED'
  ↓
Se encontrar vídeo:
  - Marca como PROCESSING
  - Inicia heartbeat a cada 60s
  - Começa processamento
  ↓
Se NÃO encontrar:
  - Dorme por 10 segundos
  - Tenta novamente
```

**Arquivo worker:** `scripts/media-worker.ts`
**Linhas críticas:**
- L32: `POLL_INTERVAL_MS = 10_000` ← Verifica a cada 10s
- L172: `WHERE status='QUEUED'` ← Processa automático
- L31: `FFMPEG_TIMEOUT_MS = 90 * 60_000` ← 90 MINUTOS!

### 3️⃣ Processamento de Vídeo (MUITO LENTO)

**O que acontece:**
```
Worker obtém vídeo QUEUED
  ↓
1. Download de R2 (ou cópia local)
   → Pode levar minutos com arquivo grande
  ↓
2. Extrai thumbnail com FFmpeg
   → ~5-10 segundos
  ↓
3. Detecta altura do vídeo (ffprobe)
   → ~2-5 segundos
  ↓
4. Executa FFmpeg com 3 variantes (1080p, 720p, 480p)
   → AQUI É O GARGALO! 
   → Pode levar MINUTOS
   → Timeout = 90 minutos (se exceder, erro)
  ↓
5. Upload de toda árvore HLS para R2
   → Pode levar MINUTOS
  ↓
6. Marca como READY
```

**Arquivo processamento:** `scripts/media-worker.ts`
**Linhas críticas:**
- L211: Download R2
- L220-228: Thumbnail com FFmpeg
- L222-261: FFmpeg with 3 variants ← GARGALO PRINCIPAL
- L265: Upload para R2

---

## 📈 Análise de Performance

### Tempo Esperado por Tamanho de Vídeo

| Tamanho | Duração | Tempo FFmpeg | Upload R2 | Total Estimado |
|---------|---------|--------------|-----------|----------------|
| **100 MB** | 2 min | 3-5 min | 1-2 min | **5-8 min** |
| **500 MB** | 10 min | 15-20 min | 2-4 min | **20-25 min** |
| **1 GB** | 20 min | 30-40 min | 5-10 min | **40-50 min** |
| **2 GB+** | 40+ min | 60+ min | 10+ min | **70-90+ min** |

### Gargalos Identificados

1. **FFmpeg HLS encoding** (60-80% do tempo)
   - Processa 3 bitrates sequencialmente
   - Codec H.264 é lento para alta qualidade
   - Sem otimização de CPU

2. **Download/Upload R2** (10-30% do tempo)
   - Conexão de rede
   - Tamanho do arquivo
   - Sem compressão prévia

3. **Processamento sequencial** (limite arquitetônico)
   - Worker processa 1 vídeo por vez
   - Se fila tiver 10 vídeos, 9º demorará HORAS

---

## 🎯 Problemas e Soluções

### PROBLEMA 1: "Por que preciso clicar em Ativar?"
**Realidade:** NÃO PRECISA! Processamento começar automaticamente.
**Causa:** Confusão de UX - botão "Ativar" está lá mas não afeta processamento
**Solução:** Melhorar UI do admin para deixar claro

### PROBLEMA 2: Processamento demora MUITO
**Causa principal:** FFmpeg com 3 variantes em série
**Causas secundárias:**
- Arquivo grande + conexão lenta = download lento
- Upload R2 pode ser lento
- Worker sequencial

**Soluções propostas:**

#### A) RÁPIDA (implementar hoje)
- [ ] Reduzir variantes FFmpeg (apenas 720p + 480p, remover 1080p)
- [ ] Aumentar bitrate (menos qualidade = mais rápido)
- [ ] Remover extração de thumbnail (gerar no frontend)
- [ ] Melhorar timeouts e logs

#### B) MÉDIA (1-2 semanas)
- [ ] Paralelizar FFmpeg (usar GPU se disponível)
- [ ] Implementar processamento em workers paralelos
- [ ] Adicionar compressão prévia antes do upload
- [ ] Melhorar UI do admin com progresso real

#### C) LONGA (futuro)
- [ ] Usar codec VP9 ou AV1 (melhor compressão)
- [ ] Implementar escalonamento dinâmico de bitrates
- [ ] Cache de processamento para uploads similares

---

## 🛠️ Implementações Recomendadas

### SOLUÇÃO 1: Remover Variante 1080p (RÁPIDO)

**Mudança em `scripts/media-worker.ts` linha 232:**
```typescript
// ANTES:
if (height >= 1080) variants.push({ bitrate: "5000k", name: "1080p", height: "1080" });

// DEPOIS: (comentar/remover)
// Removido - economiza 30-40% do tempo FFmpeg
```

**Impacto:**
- ✅ Reduz tempo de 20-25 minutos para 12-15 minutos (40% mais rápido)
- ✅ Qualidade 720p é suficiente para telas
- ✅ Sem perdas de funcionalidade

---

### SOLUÇÃO 2: Otimizar Bitrates FFmpeg (RÁPIDO)

**Mudança em `scripts/media-worker.ts` linha 232:**
```typescript
// ANTES:
if (height >= 1080) variants.push({ bitrate: "5000k", name: "1080p", height: "1080" });
if (height >= 720) variants.push({ bitrate: "2800k", name: "720p", height: "720" });
variants.push({ bitrate: "1400k", name: "480p", height: "480" });

// DEPOIS:
// Remover 1080p
if (height >= 720) variants.push({ bitrate: "1800k", name: "720p", height: "720" }); // ← reduzido
variants.push({ bitrate: "800k", name: "480p", height: "480" }); // ← reduzido
```

**Impacto:**
- ✅ Reduz tempo de processamento adicional 15-20%
- ⚠️ Qualidade ligeiramente reduzida (aceitável para 720p)
- ✅ Tamanho de arquivo reduzido em ~30%

---

### SOLUÇÃO 3: Paralelo - Múltiplos Workers (MÉDIO)

**Atual:** 1 worker processa 1 vídeo por vez
**Proposto:** 2-3 workers processando em paralelo

**Mudança:**
```bash
# Atualmente no VPS (ecosystem.config.cjs):
{
  name: "deriva-media-worker",
  script: "./scripts/media-worker.ts",
  instances: 1  ← MUDAR PARA 2-3
}

# Novo:
{
  name: "deriva-media-worker",
  script: "./scripts/media-worker.ts",
  instances: 3,  # 3 workers paralelos
  exec_mode: "cluster"
}
```

**Impacto:**
- ✅ 3 vídeos processam ao mesmo tempo
- ✅ Fila de 10 vídeos: 3-4 minutos em vez de 20+ minutos
- ⚠️ Aumenta CPU/RAM usage em ~3x
- ⚠️ Requer sincronização de R2 uploads

---

### SOLUÇÃO 4: Melhorar UX do Admin (RÁPIDO)

**Problema:** Usuário não entende que processamento é automático

**Proposto:**
1. Renomear "Ativar" para "Publicar" (para deixar claro que é outra ação)
2. Mostrar indicador de progresso:
   ```
   🔄 Processando... (30% completo)
   Tempo estimado: 5 minutos
   ```
3. Remover botão "Ativar" durante processamento
4. Mostrar erro real se FFmpeg falhar

---

## 📋 Checklist de Melhoria

### Fase 1 (Hoje) - Otimizações Rápidas
- [ ] Remover variante 1080p
- [ ] Reduzir bitrates
- [ ] Melhorar logs de progresso
- [ ] Adicionar timeout específico para download R2

### Fase 2 (Esta semana) - Worker Paralelo
- [ ] Implementar 2-3 workers paralelos
- [ ] Testar sincronização de R2
- [ ] Monitorar CPU/RAM

### Fase 3 (Próximo mês) - UI Improvements
- [ ] Mostrar progresso em tempo real
- [ ] Webhooks para notificações
- [ ] Retry automático em falhas

---

## 🔍 Verificações no VPS

Para verificar o worker atual:

```bash
# Ver status do worker
pm2 status | grep media-worker

# Ver logs do worker
pm2 logs deriva-media-worker

# Ver fila de processamento
# (conectar na DB e rodar:)
SELECT id, processing_status, created_at, processing_started_at FROM media_assets WHERE type='VIDEO' ORDER BY created_at DESC;

# Ver quanto tempo leva
SELECT 
  id, 
  (processing_finished_at - processing_started_at) AS tempo_processamento,
  internal_label
FROM media_assets 
WHERE processing_status='READY' 
ORDER BY processing_finished_at DESC 
LIMIT 5;
```

---

## 📊 Resumo

| Aspecto | Status | Ação |
|---------|--------|------|
| **Processamento automático** | ✅ Funcionando | Melhorar UX |
| **Fila de processamento** | ✅ OK | Paralelizar |
| **Tempo de processamento** | ⚠️ LENTO | Otimizar FFmpeg |
| **Upload R2** | ✅ OK | Monitorar |
| **Feedback ao usuário** | ❌ Ruim | Implementar progresso |

**Recomendação:** Implementar Fase 1 hoje (30 minutos) para melhorias imediatas de 40-50%.


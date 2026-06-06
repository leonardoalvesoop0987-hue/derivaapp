"use client";

import { useState, useEffect } from "react";
import { Loader2, Play, RefreshCw, Trash2 } from "lucide-react";

export default function VoiceSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  
  const [settings, setSettings] = useState({
    enabled: false,
    provider: "elevenlabs",
    playbackMode: "manual",
    apiKey: "",
    voiceId: ""
  });

  const [audios, setAudios] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/voice/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          enabled: data.enabled ?? false,
          provider: data.provider ?? "elevenlabs",
          playbackMode: data.playbackMode ?? "manual",
          apiKey: data.apiKey ?? "", // Will be masked or empty if from DB
          voiceId: data.voiceId ?? ""
        });
      }

      const resAudios = await fetch("/api/admin/voice/audios");
      if (resAudios.ok) {
        const ad = await resAudios.json();
        setAudios(ad);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/admin/voice/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      alert("Configurações salvas.");
    } catch (e) {
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    try {
      const res = await fetch("/api/admin/voice/test", { method: "POST" });
      const data = await res.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play();
      } else {
        alert("Falha no teste: " + (data.reason || "Erro desconhecido"));
      }
    } catch (e) {
      alert("Erro no teste.");
    } finally {
      setTesting(false);
    }
  }

  async function handleClearCache() {
    if (!confirm("Tem certeza que deseja apagar o histórico de áudios no banco? (Os arquivos no R2 não serão apagados automaticamente agora)")) return;
    try {
      await fetch("/api/admin/voice/cache", { method: "DELETE" });
      fetchData();
    } catch (e) {
      alert("Erro ao limpar cache.");
    }
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-2xl font-light">Narração por Voz (TTS)</h1>

      <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-2xl space-y-6">
        <h2 className="font-medium text-lg border-b border-white/5 pb-2">Configuração Principal</h2>
        
        <div className="flex items-center gap-4">
          <input 
            type="checkbox" 
            checked={settings.enabled} 
            onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
            className="w-5 h-5"
          />
          <label>Habilitar TTS (Narração de Cartas)</label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Modo de Reprodução na Sessão</label>
            <select 
              value={settings.playbackMode}
              onChange={(e) => setSettings({...settings, playbackMode: e.target.value})}
              className="w-full bg-[#130c0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
            >
              <option value="manual">Manual (Requer clique)</option>
              <option value="automatic">Automático (Ao virar a carta)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Provider</label>
            <select 
              value={settings.provider}
              onChange={(e) => setSettings({...settings, provider: e.target.value})}
              className="w-full bg-[#130c0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
            >
              <option value="elevenlabs">ElevenLabs</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">ElevenLabs API Key</label>
            <input 
              type="password" 
              placeholder="Deixe em branco para manter a atual ou carregar do .env"
              value={settings.apiKey}
              onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
              className="w-full bg-[#130c0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono"
            />
            <p className="text-xs text-white/40 mt-1">Sempre armazenada criptografada no banco (se informada aqui).</p>
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">ElevenLabs Voice ID</label>
            <input 
              type="text" 
              value={settings.voiceId}
              onChange={(e) => setSettings({...settings, voiceId: e.target.value})}
              className="w-full bg-[#130c0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-white/5">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#d4a373] text-black px-6 py-2 rounded-xl font-medium hover:bg-[#e5b887]"
          >
            {saving ? "Salvando..." : "Salvar Configurações"}
          </button>
          
          <button 
            onClick={handleTest} 
            disabled={testing}
            className="flex items-center gap-2 bg-white/10 text-white px-6 py-2 rounded-xl hover:bg-white/20"
          >
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Testar Voz
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h2 className="font-medium text-lg">Histórico / Cache de Áudios</h2>
          <button onClick={handleClearCache} className="text-red-400 text-sm flex items-center gap-2 hover:text-red-300">
            <Trash2 className="w-4 h-4" /> Limpar Registros
          </button>
        </div>
        
        <p className="text-sm text-[var(--color-text-secondary)]">Total de áudios em cache: {audios.length}</p>
        
        <div className="max-h-96 overflow-y-auto space-y-2">
          {audios.map(a => (
            <div key={a.id} className="bg-[#130c0a] p-3 rounded-lg border border-white/5 flex items-center justify-between">
              <div className="truncate pr-4 flex-1">
                <span className={`text-xs font-bold mr-2 ${a.status === 'READY' ? 'text-green-400' : a.status === 'ERROR' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {a.status}
                </span>
                <span className="text-sm text-white/80" title={a.card?.title || a.card_id}>{a.card?.title || a.card_id}</span>
                <span className="text-xs text-white/40 block mt-1 truncate">{a.text_used}</span>
              </div>
              {a.audio_url && (
                <button 
                  onClick={() => new Audio(a.audio_url).play()} 
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full"
                >
                  <Play className="w-4 h-4 text-[#d4a373]" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

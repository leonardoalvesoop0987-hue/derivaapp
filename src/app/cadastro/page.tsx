"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [p1Name, setP1Name] = useState("");
  const [p1Role, setP1Role] = useState<"WOMAN" | "MAN">("WOMAN");
  const [p1Email, setP1Email] = useState("");

  const [p2Name, setP2Name] = useState("");
  const [p2Role, setP2Role] = useState<"WOMAN" | "MAN">("MAN");
  const [p2Email, setP2Email] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          password,
          p1Name,
          p1Role,
          p1Email,
          p2Name,
          p2Role,
          p2Email
        }),
      });

      if (!res.ok) {
        const data: { error: string } = await res.json();
        throw new Error(data.error || "Erro ao criar conta");
      }

      router.push("/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[var(--color-card)] p-8 rounded-2xl shadow-xl border border-[var(--color-border)] my-8">
        <h1 className="text-3xl font-light text-center mb-2 tracking-wide">DERIVA</h1>
        <p className="text-center text-[var(--color-text-secondary)] mb-8 text-sm">
          Crie a conta do casal para iniciar.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-[var(--color-red-deep)]/20 border border-[var(--color-red-deep)] text-white text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-medium border-b border-[var(--color-border)] pb-2">Conta Compartilhada</h2>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Nome de Usuário do Casal</label>
              <input
                type="text"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-copper)] text-white transition-colors"
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">Um nome único para vocês acessarem juntos.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Senha</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-copper)] text-white transition-colors"
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">Mínimo de 8 caracteres.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium border-b border-[var(--color-border)] pb-2 mt-6">Pessoa 1</h2>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Nome / Apelido</label>
              <input
                type="text"
                required
                minLength={2}
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-copper)] text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Sexo</label>
              <select
                value={p1Role}
                onChange={(e) => setP1Role(e.target.value as "WOMAN" | "MAN")}
                className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-copper)] text-white transition-colors"
              >
                <option value="WOMAN">Feminino</option>
                <option value="MAN">Masculino</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">E-mail (opcional)</label>
              <input
                type="email"
                value={p1Email}
                onChange={(e) => setP1Email(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-copper)] text-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium border-b border-[var(--color-border)] pb-2 mt-6">Pessoa 2</h2>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Nome / Apelido</label>
              <input
                type="text"
                required
                minLength={2}
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-copper)] text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Sexo</label>
              <select
                value={p2Role}
                onChange={(e) => setP2Role(e.target.value as "WOMAN" | "MAN")}
                className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-copper)] text-white transition-colors"
              >
                <option value="WOMAN">Feminino</option>
                <option value="MAN">Masculino</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">E-mail (opcional)</label>
              <input
                type="email"
                value={p2Email}
                onChange={(e) => setP2Email(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-copper)] text-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[var(--color-wine)] hover:bg-[var(--color-red-deep)] transition-colors rounded-xl font-medium tracking-wide disabled:opacity-60 mt-8"
          >
            {loading ? "Criando..." : "Criar conta do casal"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-[var(--color-copper)] hover:underline">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}

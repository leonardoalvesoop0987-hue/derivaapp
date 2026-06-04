"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ email, password }),
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
      <div className="w-full max-w-md bg-[var(--color-card)] p-8 rounded-2xl shadow-xl border border-[var(--color-border)]">
        <h1 className="text-3xl font-light text-center mb-2 tracking-wide">DERIVA</h1>
        <p className="text-center text-[var(--color-text-secondary)] mb-8 text-sm">
          Crie sua conta para iniciar sessões.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-[var(--color-red-deep)]/20 border border-[var(--color-red-deep)] text-white text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-copper)] text-white transition-colors"
            />
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
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[var(--color-wine)] hover:bg-[var(--color-red-deep)] transition-colors rounded-xl font-medium tracking-wide disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar conta"}
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

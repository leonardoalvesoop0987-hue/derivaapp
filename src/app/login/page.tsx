"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      if (!res.ok) {
        const data: { error: string } = await res.json();
        throw new Error(data.error || "Erro ao fazer login");
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
          Acesse sua conta para iniciar.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-[var(--color-red-deep)]/20 border border-[var(--color-red-deep)] text-white text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Usuário do Casal (ou E-mail)</label>
            <input
              type="text"
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-copper)] text-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-copper)] text-white transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[var(--color-wine)] hover:bg-[var(--color-red-deep)] transition-colors rounded-xl font-medium tracking-wide disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="text-[var(--color-copper)] hover:underline">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}

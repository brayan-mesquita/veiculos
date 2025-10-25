"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react";

interface ApiToken {
  id: number;
  nome: string;
  token: string;
  ativo: boolean;
  createdAt: string;
  ultimoUso: string | null;
}

export default function ApiTokensPage() {
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTokenName, setNewTokenName] = useState("");
  const [creating, setCreating] = useState(false);
  const [visibleTokens, setVisibleTokens] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchTokens();
  }, []);

  async function fetchTokens() {
    try {
      const response = await fetch("/api/api-tokens");
      if (response.ok) {
        const data = await response.json();
        setTokens(data);
      } else {
        console.error("Erro ao buscar tokens");
      }
    } catch (error) {
      console.error("Erro ao buscar tokens:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createToken() {
    if (!newTokenName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch("/api/api-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: newTokenName }),
      });

      if (response.ok) {
        const newToken = await response.json();
        setTokens([...tokens, newToken]);
        setNewTokenName("");
      } else {
        alert("Erro ao criar token");
      }
    } catch (error) {
      console.error("Erro ao criar token:", error);
      alert("Erro ao criar token");
    } finally {
      setCreating(false);
    }
  }

  async function deleteToken(id: number) {
    if (!confirm("Tem certeza que deseja excluir este token?")) return;

    try {
      const response = await fetch(`/api/api-tokens/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTokens(tokens.filter((token) => token.id !== id));
      } else {
        alert("Erro ao excluir token");
      }
    } catch (error) {
      console.error("Erro ao excluir token:", error);
      alert("Erro ao excluir token");
    }
  }

  function toggleTokenVisibility(id: number) {
    const newVisible = new Set(visibleTokens);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleTokens(newVisible);
  }

  function copyToken(token: string) {
    navigator.clipboard.writeText(token);
    alert("Token copiado para a área de transferência!");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Tokens de API</h1>
          <Link
            href="/dashboard"
            className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
          >
            Voltar
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Gerenciar Tokens de API</h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Nome do token"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2"
            />
            <button
              onClick={createToken}
              disabled={creating || !newTokenName.trim()}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/80 disabled:opacity-70"
            >
              <Plus className="h-4 w-4" />
              {creating ? "Criando..." : "Criar Token"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">Carregando tokens...</p>
          </div>
        ) : tokens.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-8 text-center">
            <div>
              <p className="text-lg font-medium">Nenhum token encontrado</p>
              <p className="text-sm text-muted-foreground">
                Crie um token para acessar a API externamente
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Token</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Último Uso</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tokens.map((token) => (
                  <tr key={token.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{token.nome}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {visibleTokens.has(token.id)
                            ? token.token
                            : "•".repeat(20)}
                        </span>
                        <button
                          onClick={() => toggleTokenVisibility(token.id)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {visibleTokens.has(token.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToken(token.token)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          token.ativo
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {token.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {token.ultimoUso ? new Date(token.ultimoUso).toLocaleString("pt-BR") : "Nunca"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteToken(token.id)}
                        className="rounded-md p-2 hover:bg-muted"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
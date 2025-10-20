"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car, Edit, Trash2, Plus } from "lucide-react";

interface Veiculo {
  id: number;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  quilometragem: number;
  preco: number;
  status: string;
}

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVeiculos() {
      try {
        const response = await fetch("/api/veiculos");
        if (response.ok) {
          const data = await response.json();
          setVeiculos(data);
        } else {
          console.error("Erro ao buscar veículos");
        }
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVeiculos();
  }, []);

  async function handleDelete(id: number) {
    if (confirm("Tem certeza que deseja excluir este veículo?")) {
      try {
        const response = await fetch(`/api/veiculos/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setVeiculos(veiculos.filter((veiculo) => veiculo.id !== id));
        } else {
          alert("Erro ao excluir veículo");
        }
      } catch (error) {
        console.error("Erro ao excluir veículo:", error);
        alert("Erro ao excluir veículo");
      }
    }
  }

  function formatarPreco(preco: number) {
    return preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Gerenciamento de Veículos</h1>
          <Link
            href="/"
            className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
          >
            Voltar
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Lista de Veículos</h2>
          <Link
            href="/veiculos/novo"
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/80"
          >
            <Plus className="h-4 w-4" />
            Novo Veículo
          </Link>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">Carregando veículos...</p>
          </div>
        ) : veiculos.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-8 text-center">
            <Car className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Nenhum veículo encontrado</p>
              <p className="text-sm text-muted-foreground">
                Comece adicionando um novo veículo ao estoque
              </p>
            </div>
            <Link
              href="/veiculos/novo"
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/80"
            >
              <Plus className="h-4 w-4" />
              Novo Veículo
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Modelo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Marca
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Ano
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Cor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Km
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Preço
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {veiculos.map((veiculo) => (
                  <tr key={veiculo.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{veiculo.modelo}</td>
                    <td className="px-4 py-3 text-sm">{veiculo.marca}</td>
                    <td className="px-4 py-3 text-sm">{veiculo.ano}</td>
                    <td className="px-4 py-3 text-sm">{veiculo.cor}</td>
                    <td className="px-4 py-3 text-sm">
                      {veiculo.quilometragem.toLocaleString()} km
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatarPreco(veiculo.preco)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          veiculo.status === "disponivel"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {veiculo.status === "disponivel"
                          ? "Disponível"
                          : "Vendido"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/veiculos/${veiculo.id}`}
                          className="rounded-md p-2 hover:bg-muted"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(veiculo.id)}
                          className="rounded-md p-2 hover:bg-muted"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
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
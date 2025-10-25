"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Car, DollarSign, BarChart3, Tag } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

interface MarcaCount {
  name: string;
  value: number;
}

interface AnoCount {
  name: number;
  value: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export default function DashboardPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [marcasData, setMarcasData] = useState<MarcaCount[]>([]);
  const [anosData, setAnosData] = useState<AnoCount[]>([]);

  useEffect(() => {
    async function fetchVeiculos() {
      try {
        const response = await fetch("/api/veiculos");
        if (response.ok) {
          const data = await response.json();
          setVeiculos(data);
          
          // Processar dados para gráficos
          processarDadosGraficos(data);
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

  function processarDadosGraficos(veiculos: Veiculo[]) {
    // Contagem de veículos por marca
    const marcasCount: Record<string, number> = {};
    veiculos.forEach(veiculo => {
      marcasCount[veiculo.marca] = (marcasCount[veiculo.marca] || 0) + 1;
    });
    
    const marcasArray = Object.entries(marcasCount).map(([name, value]) => ({ name, value }));
    setMarcasData(marcasArray);

    // Contagem de veículos por ano
    const anosCount: Record<number, number> = {};
    veiculos.forEach(veiculo => {
      anosCount[veiculo.ano] = (anosCount[veiculo.ano] || 0) + 1;
    });
    
    const anosArray = Object.entries(anosCount).map(([name, value]) => ({ name: parseInt(name), value }));
    setAnosData(anosArray.sort((a, b) => a.name - b.name));
  }

  function calcularValorTotal() {
    return veiculos.reduce((total, veiculo) => total + veiculo.preco, 0);
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
          <h1 className="text-2xl font-bold">Sistema de Veículos</h1>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-4">
              <Link href="/veiculos" className="text-sm font-medium hover:text-primary">
                Veículos
              </Link>
              <Link href="/veiculos/novo" className="text-sm font-medium hover:text-primary">
                Cadastrar
              </Link>
              <Link href="/api/docs" className="text-sm font-medium hover:text-primary">
                API
              </Link>
              <Link href="/api-tokens" className="text-sm font-medium hover:text-primary">
                Tokens API
              </Link>
            </nav>
            <button
              onClick={() => signOut()}
              className="rounded-md bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/80"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Veículos</p>
                    <h3 className="text-2xl font-bold">{veiculos.length}</h3>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                    <h3 className="text-2xl font-bold">{formatarPreco(calcularValorTotal())}</h3>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Tag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Marcas Diferentes</p>
                    <h3 className="text-2xl font-bold">{marcasData.length}</h3>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Preço Médio</p>
                    <h3 className="text-2xl font-bold">
                      {formatarPreco(calcularValorTotal() / (veiculos.length || 1))}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Veículos por Marca</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marcasData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {marcasData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} veículos`, 'Quantidade']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Veículos por Ano</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={anosData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} veículos`, 'Quantidade']} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Veículos Recentes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-2 text-left text-sm font-medium">Modelo</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Marca</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Ano</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {veiculos.slice(0, 5).map((veiculo) => (
                      <tr key={veiculo.id} className="border-b border-border">
                        <td className="px-4 py-2 text-sm">{veiculo.modelo}</td>
                        <td className="px-4 py-2 text-sm">{veiculo.marca}</td>
                        <td className="px-4 py-2 text-sm">{veiculo.ano}</td>
                        <td className="px-4 py-2 text-sm">{formatarPreco(veiculo.preco)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import { ThemeToggle } from '@/components/theme-toggle';
import { Car, DollarSign, BarChart3, Tag } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";

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

const CHART_COLORS = [
  "#3b82f6",
  "#84cc16",
  "#f97316",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
];

export default function Home() {
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

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
      <Skeleton className="h-64" />
    </>
  );
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
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <DashboardSkeleton />
        ) : veiculos.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <motion.div whileHover={{ scale: 1.05 }} className="rounded-lg border border-border bg-card p-6 shadow-sm transition-transform">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Veículos</p>
                    <h3 className="text-2xl font-bold">{veiculos.length}</h3>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="rounded-lg border border-border bg-card p-6 shadow-sm transition-transform">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                    <h3 className="text-2xl font-bold">{formatarPreco(calcularValorTotal())}</h3>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="rounded-lg border border-border bg-card p-6 shadow-sm transition-transform">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Tag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Marcas Diferentes</p>
                    <h3 className="text-2xl font-bold">{marcasData.length}</h3>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="rounded-lg border border-border bg-card p-6 shadow-sm transition-transform">
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
              </motion.div>
            </div>

            <div className="mb-8 grid gap-6 lg:grid-cols-2">
              <motion.div whileHover={{ scale: 1.02 }} className="rounded-lg border border-border bg-card p-6 shadow-sm transition-transform">
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
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} veículos`, 'Quantidade']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="rounded-lg border border-border bg-card p-6 shadow-sm transition-transform">
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
                      <Bar dataKey="value" fill={CHART_COLORS[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} className="rounded-lg border border-border bg-card p-6 shadow-sm transition-transform">
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
                    {veiculos.slice(0, 5).map((veiculo, index) => (
                      <tr
                        key={veiculo.id}
                        className={cn(
                          "border-b border-border",
                          index % 2 === 0 ? "bg-card" : "bg-muted/50"
                        )}
                      >
                        <td className="px-4 py-2 text-sm">{veiculo.modelo}</td>
                        <td className="px-4 py-2 text-sm">{veiculo.marca}</td>
                        <td className="px-4 py-2 text-sm">{veiculo.ano}</td>
                        <td className="px-4 py-2 text-sm">{formatarPreco(veiculo.preco)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
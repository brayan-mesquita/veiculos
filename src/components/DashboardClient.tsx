'use client';

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Car, DollarSign, BarChart3, Tag } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Interfaces transferidas para cá
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

interface DashboardClientProps {
  veiculos: Veiculo[];
  marcasData: MarcaCount[];
  anosData: AnoCount[];
  valorTotal: number;
  totalVeiculos: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

function formatarPreco(preco: number) {
  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function DashboardClient({ veiculos, marcasData, anosData, valorTotal, totalVeiculos }: DashboardClientProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Sistema de Veículos</h1>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-4">
              <Link href="/veiculos" className="text-sm font-medium hover:text-primary">Veículos</Link>
              <Link href="/veiculos/novo" className="text-sm font-medium hover:text-primary">Cadastrar</Link>
            </nav>
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="rounded-md bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/80"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Veículos</p>
                <h3 className="text-2xl font-bold">{totalVeiculos}</h3>
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
                <h3 className="text-2xl font-bold">{formatarPreco(valorTotal)}</h3>
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
                  {formatarPreco(valorTotal / (totalVeiculos || 1))}
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
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
      </main>
    </div>
  );
}

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import DashboardClient from "@/components/DashboardClient";
import { redirect } from "next/navigation";

// A interface pode ser compartilhada ou definida aqui
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

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: veiculos, error } = await supabase.from('veiculos').select('*');

  if (error) {
    return <p className="p-8 text-destructive">Erro ao carregar os dados dos veículos.</p>;
  }

  // Processamento de dados no servidor
  const totalVeiculos = veiculos.length;
  const valorTotal = veiculos.reduce((total, veiculo) => total + veiculo.preco, 0);

  const marcasCount: Record<string, number> = {};
  veiculos.forEach(veiculo => {
    marcasCount[veiculo.marca] = (marcasCount[veiculo.marca] || 0) + 1;
  });
  const marcasData = Object.entries(marcasCount).map(([name, value]) => ({ name, value }));

  const anosCount: Record<number, number> = {};
  veiculos.forEach(veiculo => {
    anosCount[veiculo.ano] = (anosCount[veiculo.ano] || 0) + 1;
  });
  const anosData = Object.entries(anosCount)
    .map(([name, value]) => ({ name: parseInt(name), value }))
    .sort((a, b) => a.name - b.name);

  return (
    <DashboardClient 
      veiculos={veiculos}
      marcasData={marcasData}
      anosData={anosData}
      totalVeiculos={totalVeiculos}
      valorTotal={valorTotal}
    />
  );
}
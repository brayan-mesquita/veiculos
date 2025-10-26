import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import EditVeiculoForm from "@/components/EditVeiculoForm";
import { notFound } from "next/navigation";

export default async function EditarVeiculoPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: veiculo, error } = await supabase
    .from("veiculos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !veiculo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Editar Veículo</h1>
          <Link
            href="/veiculos"
            className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
          >
            Voltar
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <EditVeiculoForm veiculo={veiculo} />
        </div>
      </main>
    </div>
  );
}
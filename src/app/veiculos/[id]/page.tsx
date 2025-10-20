"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

interface VeiculoData {
  id: number;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  quilometragem: number;
  preco: number;
  descricao: string;
  combustivel: string;
  cambio: string;
  status: string;
}

export default function EditarVeiculoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<VeiculoData>({
    id: 0,
    modelo: "",
    marca: "",
    ano: new Date().getFullYear(),
    cor: "",
    quilometragem: 0,
    preco: 0,
    descricao: "",
    combustivel: "",
    cambio: "",
    status: "disponivel"
  });

  useEffect(() => {
    async function fetchVeiculo() {
      try {
        const response = await fetch(`/api/veiculos/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          alert("Erro ao buscar dados do veículo");
          router.push("/veiculos");
        }
      } catch (error) {
        console.error("Erro ao buscar veículo:", error);
        alert("Erro ao buscar dados do veículo");
        router.push("/veiculos");
      } finally {
        setLoading(false);
      }
    }

    fetchVeiculo();
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "ano" || name === "quilometragem" || name === "preco" 
        ? parseInt(value) 
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/veiculos/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/veiculos");
      } else {
        const error = await response.json();
        alert(`Erro ao atualizar veículo: ${error.error}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
      alert("Erro ao atualizar veículo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando dados do veículo...</p>
      </div>
    );
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="modelo" className="text-sm font-medium">
                  Modelo *
                </label>
                <input
                  id="modelo"
                  name="modelo"
                  type="text"
                  required
                  value={formData.modelo}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="marca" className="text-sm font-medium">
                  Marca *
                </label>
                <input
                  id="marca"
                  name="marca"
                  type="text"
                  required
                  value={formData.marca}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="ano" className="text-sm font-medium">
                  Ano *
                </label>
                <input
                  id="ano"
                  name="ano"
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.ano}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="cor" className="text-sm font-medium">
                  Cor *
                </label>
                <input
                  id="cor"
                  name="cor"
                  type="text"
                  required
                  value={formData.cor}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="quilometragem" className="text-sm font-medium">
                  Quilometragem *
                </label>
                <input
                  id="quilometragem"
                  name="quilometragem"
                  type="number"
                  required
                  min="0"
                  value={formData.quilometragem}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="preco" className="text-sm font-medium">
                  Preço (R$) *
                </label>
                <input
                  id="preco"
                  name="preco"
                  type="number"
                  required
                  min="0"
                  value={formData.preco}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="combustivel" className="text-sm font-medium">
                  Combustível
                </label>
                <select
                  id="combustivel"
                  name="combustivel"
                  value={formData.combustivel || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Selecione</option>
                  <option value="Flex">Flex</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Etanol">Etanol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Elétrico">Elétrico</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="cambio" className="text-sm font-medium">
                  Câmbio
                </label>
                <select
                  id="cambio"
                  name="cambio"
                  value={formData.cambio || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Selecione</option>
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                  <option value="CVT">CVT</option>
                  <option value="Semi-automático">Semi-automático</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="disponivel">Disponível</option>
                  <option value="vendido">Vendido</option>
                  <option value="reservado">Reservado</option>
                  <option value="manutencao">Em Manutenção</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="descricao" className="text-sm font-medium">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={4}
                value={formData.descricao || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href="/veiculos"
                className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
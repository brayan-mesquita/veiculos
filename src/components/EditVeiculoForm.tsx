'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

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

interface EditVeiculoFormProps {
  veiculo: VeiculoData;
}

export default function EditVeiculoForm({ veiculo }: EditVeiculoFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<VeiculoData>(veiculo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'ano' || name === 'quilometragem' || name === 'preco' 
        ? parseInt(value) 
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { id, ...updateData } = formData;

    try {
      const { error } = await supabase
        .from('veiculos')
        .update(updateData)
        .eq('id', id);

      if (error) {
        alert(`Erro ao atualizar veículo: ${error.message}`);
      } else {
        router.push('/veiculos');
        router.refresh();
      }
    } catch (error: any) {
      console.error("Erro ao atualizar veículo:", error);
      alert(`Erro ao atualizar veículo: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="modelo" className="text-sm font-medium">Modelo *</label>
          <input id="modelo" name="modelo" type="text" required value={formData.modelo} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2" />
        </div>
        <div className="space-y-2">
          <label htmlFor="marca" className="text-sm font-medium">Marca *</label>
          <input id="marca" name="marca" type="text" required value={formData.marca} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2" />
        </div>
        <div className="space-y-2">
          <label htmlFor="ano" className="text-sm font-medium">Ano *</label>
          <input id="ano" name="ano" type="number" required min="1900" max={new Date().getFullYear() + 1} value={formData.ano} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2" />
        </div>
        <div className="space-y-2">
          <label htmlFor="cor" className="text-sm font-medium">Cor *</label>
          <input id="cor" name="cor" type="text" required value={formData.cor} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2" />
        </div>
        <div className="space-y-2">
          <label htmlFor="quilometragem" className="text-sm font-medium">Quilometragem *</label>
          <input id="quilometragem" name="quilometragem" type="number" required min="0" value={formData.quilometragem} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2" />
        </div>
        <div className="space-y-2">
          <label htmlFor="preco" className="text-sm font-medium">Preço (R$) *</label>
          <input id="preco" name="preco" type="number" required min="0" value={formData.preco} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2" />
        </div>
        <div className="space-y-2">
          <label htmlFor="combustivel" className="text-sm font-medium">Combustível</label>
          <select id="combustivel" name="combustivel" value={formData.combustivel || ''} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2">
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
          <label htmlFor="cambio" className="text-sm font-medium">Câmbio</label>
          <select id="cambio" name="cambio" value={formData.cambio || ''} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2">
            <option value="">Selecione</option>
            <option value="Manual">Manual</option>
            <option value="Automático">Automático</option>
            <option value="CVT">CVT</option>
            <option value="Semi-automático">Semi-automático</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2">
            <option value="disponivel">Disponível</option>
            <option value="vendido">Vendido</option>
            <option value="reservado">Reservado</option>
            <option value="manutencao">Em Manutenção</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="descricao" className="text-sm font-medium">Descrição</label>
        <textarea id="descricao" name="descricao" rows={4} value={formData.descricao || ''} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2" />
      </div>
      <div className="flex justify-end gap-4">
        <Link href="/veiculos" className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground">
          <ArrowLeft className="h-4 w-4" />
          Cancelar
        </Link>
        <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-70">
          <Save className="h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

'use client';

import { supabase } from '@/lib/supabase/client';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteVeiculoButtonProps {
  id: number;
}

export default function DeleteVeiculoButton({ id }: DeleteVeiculoButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      const { error } = await supabase.from('veiculos').delete().eq('id', id);

      if (error) {
        alert('Erro ao excluir veículo');
        console.error(error);
      } else {
        // Revalida a página para buscar os dados novamente no servidor
        router.refresh();
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-md p-2 hover:bg-muted"
      title="Excluir"
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </button>
  );
}

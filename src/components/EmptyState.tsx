import { Car } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center shadow-sm">
      <div className="mb-4 rounded-full bg-primary/10 p-4">
        <Car className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold">Nenhum veículo encontrado</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Parece que ainda não há veículos cadastrados. Que tal adicionar o primeiro?
      </p>
    </div>
  );
}
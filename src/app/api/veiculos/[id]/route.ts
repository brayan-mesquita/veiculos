import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { veiculos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET /api/veiculos/[id] - Obter um veículo específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    
    const result = await db.select().from(veiculos).where(eq(veiculos.id, id));
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Erro ao buscar veículo:", error);
    return NextResponse.json(
      { error: "Erro ao buscar veículo" },
      { status: 500 }
    );
  }
}

// PUT /api/veiculos/[id] - Atualizar um veículo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Remover campos que não devem ser atualizados diretamente
    const { id: bodyId, createdAt, created_at, created_at: _ca, ...updates } = body as any;

    // Atualiza o timestamp de atualização
    updates.updatedAt = Math.floor(Date.now() / 1000);

    // Se houver campo 'fotos' como array, stringify para armazenar como JSON no DB
    if (updates.fotos && Array.isArray(updates.fotos)) {
      updates.fotos = JSON.stringify(updates.fotos);
    }

    await db.update(veiculos)
      .set(updates)
      .where(eq(veiculos.id, id));
    
    return NextResponse.json(
      { message: "Veículo atualizado com sucesso" }
    );
  } catch (error) {
    // Log mais detalhado para ajudar no diagnóstico
    console.error("Erro ao atualizar veículo (detalhe):", error instanceof Error ? error.message : error, error);
    return NextResponse.json(
      { error: "Erro ao atualizar veículo" },
      { status: 500 }
    );
  }
}

// DELETE /api/veiculos/[id] - Excluir um veículo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    
    await db.delete(veiculos).where(eq(veiculos.id, id));
    
    return NextResponse.json(
      { message: "Veículo excluído com sucesso" }
    );
  } catch (error) {
    console.error("Erro ao excluir veículo:", error);
    return NextResponse.json(
      { error: "Erro ao excluir veículo" },
      { status: 500 }
    );
  }
}
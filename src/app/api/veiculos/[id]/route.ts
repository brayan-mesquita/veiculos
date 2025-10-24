import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/veiculos/[id] - Obter um veículo específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const veiculo = await prisma.veiculo.findUnique({
      where: { id },
    });

    if (!veiculo) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(veiculo);
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
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();

    const veiculo = await prisma.veiculo.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(veiculo);
  } catch (error) {
    console.error("Erro ao atualizar veículo:", error);
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
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.veiculo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Veículo excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir veículo:", error);
    return NextResponse.json(
      { error: "Erro ao excluir veículo" },
      { status: 500 }
    );
  }
}
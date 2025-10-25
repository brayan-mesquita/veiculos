import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// DELETE /api/api-tokens/[id] - Excluir um token
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.apiToken.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Token excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir token:", error);
    return NextResponse.json(
      { error: "Erro ao excluir token" },
      { status: 500 }
    );
  }
}
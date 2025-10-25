import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// GET /api/api-tokens - Listar todos os tokens
export async function GET(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const tokens = await prisma.apiToken.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tokens);
  } catch (error) {
    console.error("Erro ao buscar tokens:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tokens" },
      { status: 500 }
    );
  }
}

// POST /api/api-tokens - Criar um novo token
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const { nome } = body;

    if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
      return NextResponse.json(
        { error: "Nome do token é obrigatório" },
        { status: 400 }
      );
    }

    // Gerar token único
    const token = `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newToken = await prisma.apiToken.create({
      data: {
        nome: nome.trim(),
        token,
        ativo: true,
      },
    });

    return NextResponse.json(newToken);
  } catch (error) {
    console.error("Erro ao criar token:", error);
    return NextResponse.json(
      { error: "Erro ao criar token" },
      { status: 500 }
    );
  }
}
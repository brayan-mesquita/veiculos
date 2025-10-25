import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// GET /api/veiculos - Listar todos os veículos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const marca = searchParams.get("marca");
    const modelo = searchParams.get("modelo");

    const where: any = {};
    if (marca) {
      where.marca = {
        contains: marca,
        mode: "insensitive",
      };
    }
    if (modelo) {
      where.modelo = {
        contains: modelo,
        mode: "insensitive",
      };
    }

    const veiculos = await prisma.veiculo.findMany({ where });

    if (veiculos.length === 0) {
      return NextResponse.json(
        { message: "Nenhum veículo encontrado com os critérios de busca fornecidos." },
        { status: 404 }
      );
    }

    return NextResponse.json(veiculos);
  } catch (error) {
    console.error("Erro ao buscar veículos:", error);
    return NextResponse.json({ error: "Erro ao buscar veículos" }, { status: 500 });
  }
}

// POST /api/veiculos - Criar um novo veículo
export async function POST(request: NextRequest) {
  try {
    // Validar autenticação
    const authError = await requireAuth(request);
    if (authError) return authError;

    const body = await request.json();

    // Validação básica
    if (!body.modelo || !body.marca || !body.ano || !body.cor || !body.quilometragem || !body.preco) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    const veiculo = await prisma.veiculo.create({
      data: {
        ...body,
        ano: parseInt(body.ano as string),
      },
    });

    return NextResponse.json(veiculo, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar veículo:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar veículo" },
      { status: 500 }
    );
  }
}
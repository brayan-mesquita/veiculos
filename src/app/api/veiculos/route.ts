import { NextRequest, NextResponse } from "next/server";
import { db, initializeDatabase } from "@/lib/db";
import { veiculos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Inicializa o banco de dados
initializeDatabase();

// GET /api/veiculos - Listar todos os veículos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const marca = searchParams.get("marca");
    const modelo = searchParams.get("modelo");
    
    // Tipagem relaxada aqui para permitir encadeamento condicional de where
    let query: any = db.select().from(veiculos);
    
    if (marca) {
      query = query.where(eq(veiculos.marca, marca));
    }
    
    if (modelo) {
      query = query.where(eq(veiculos.modelo, modelo));
    }
    
    const result = await query;

    // Converter Date objects para timestamps
    const veiculosComTimestamp = result.map(veiculo => ({
      ...veiculo,
      createdAt: veiculo.createdAt instanceof Date ? Math.floor(veiculo.createdAt.getTime() / 1000) : veiculo.createdAt,
      updatedAt: veiculo.updatedAt instanceof Date ? Math.floor(veiculo.updatedAt.getTime() / 1000) : veiculo.updatedAt,
    }));

    return NextResponse.json(veiculosComTimestamp);
  } catch (error) {
    console.error("Erro ao buscar veículos:", error);
    return NextResponse.json({ error: "Erro ao buscar veículos" }, { status: 500 });
  }
}

// POST /api/veiculos - Criar um novo veículo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica
    if (!body.modelo || !body.marca || !body.ano || !body.cor || !body.quilometragem || !body.preco) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }
    
    // Inserir o veículo no banco de dados
    await db.insert(veiculos).values({
      ...body,
      ano: parseInt(body.ano as string),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return NextResponse.json(
      { message: "Veículo cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar veículo:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar veículo" },
      { status: 500 }
    );
  }
}
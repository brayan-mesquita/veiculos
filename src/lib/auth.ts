import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function requireAuth(request: NextRequest) {
  // Verificar API key primeiro
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "").replace("ApiKey ", "");
    if (token) {
      const apiToken = await prisma.apiToken.findUnique({
        where: { token, ativo: true },
      });
      if (apiToken) {
        // Atualizar ultimoUso
        await prisma.apiToken.update({
          where: { id: apiToken.id },
          data: { ultimoUso: new Date() },
        });
        return null; // Autenticado via API key
      }
    }
  }

  // Verificar sessão NextAuth
  const session = await getServerSession();
  if (session) {
    return null; // Autenticado via sessão
  }

  return NextResponse.json(
    { error: "Não autenticado" },
    { status: 401 }
  );
}
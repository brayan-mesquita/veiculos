
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

async function checkApiKey(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "").replace("ApiKey ", "")
    if (token) {
      const apiToken = await prisma.apiToken.findUnique({
        where: { token, ativo: true },
      })
      if (apiToken) {
        return true
      }
    }
  }
  return false
}

export default withAuth(
  async function middleware(req) {
    // Redirecionar / para /dashboard se autenticado
    if (req.nextUrl.pathname === "/" && req.nextauth?.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Para rotas de API, verificar API key ou sessão
    if (req.nextUrl.pathname.startsWith("/api/")) {
      const hasApiKey = await checkApiKey(req)
      const hasSession = !!req.nextauth?.token

      if (!hasApiKey && !hasSession) {
        return NextResponse.json(
          { error: "Não autenticado" },
          { status: 401 }
        )
      }
    }

    // Todas as outras rotas protegidas pelo NextAuth
    return null
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Para rotas de API, sempre permitir (verificação no middleware)
        if (req.nextUrl.pathname.startsWith("/api/")) {
          return true
        }
        // Para outras rotas, verificar se há token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/veiculos",
    "/veiculos/novo",
    "/api-tokens",
    "/api/veiculos/:path*",
    "/api/api-tokens/:path*"
  ]
}

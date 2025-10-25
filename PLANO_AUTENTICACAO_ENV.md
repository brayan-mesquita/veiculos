# Plano de Autenticação com Credenciais no .env

## Status Atual da Implementação

A autenticação foi **parcialmente implementada**:
- ✅ Modelo `Admin` criado no Prisma
- ✅ Rota de autenticação NextAuth configurada
- ✅ Página de login criada
- ✅ Middleware de proteção de rotas
- ✅ Script de seed com bcrypt
- ✅ Variáveis de ambiente configuradas (ADMIN_USER, ADMIN_PASSWORD)

**O que falta:**
- ❌ Proteção de rotas da API (`/api/veiculos`)
- ❌ Validação de token JWT nas requisições da API
- ❌ Rota de logout
- ❌ Tratamento de sessão expirada
- ❌ Proteção contra CSRF

---

## Plano Completo de Autenticação com .env

### Fase 1: Configuração do Arquivo .env

**Arquivo: `.env`**

Adicionar/verificar as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL="postgresql://postgres:Nayarb13!@db.fdkdlawysxnfxmkevayj.supabase.co:5432/postgres"

# Credenciais do Admin (armazenadas em .env)
ADMIN_USER="admin"
ADMIN_PASSWORD="password123"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tKlCeWLh4IYGpoHPogN3Zal9otWA/+dZASWQKDssj10="

# Supabase (opcional, para upload de fotos)
NEXT_PUBLIC_SUPABASE_URL="sua_url_supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_chave_anonima"
```

---

### Fase 2: Validação e Seed do Banco de Dados

**Arquivo: `prisma/seed.ts`** (já implementado ✅)

O script já:
1. Lê `ADMIN_USER` e `ADMIN_PASSWORD` do `.env`
2. Faz hash da senha com bcrypt
3. Cria ou atualiza o usuário admin no banco

**Executar:**
```bash
npx prisma db seed
```

---

### Fase 3: Proteção de Rotas da API

**Arquivo: `src/middleware.ts`** (atualizar)

Expandir o middleware para proteger rotas da API:

```typescript
export { default } from "next-auth/middleware"

export const config = { 
  matcher: [
    "/dashboard", 
    "/veiculos/novo",
    "/api/veiculos/:path*"  // Proteger todas as rotas de API
  ] 
}
```

---

### Fase 4: Criar Utilitário de Autenticação

**Arquivo: `src/lib/auth.ts`** (novo)

Criar funções auxiliares para validar sessão:

```typescript
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    );
  }
  
  return null; // Autenticado
}
```

---

### Fase 5: Proteger Rotas da API

**Arquivo: `src/app/api/veiculos/route.ts`** (atualizar)

Adicionar validação de autenticação:

```typescript
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Validar autenticação
  const authError = await requireAuth(request);
  if (authError) return authError;

  // ... resto do código
}

export async function DELETE(request: NextRequest) {
  // Validar autenticação
  const authError = await requireAuth(request);
  if (authError) return authError;

  // ... resto do código
}
```

---

### Fase 6: Criar Rota de Logout

**Arquivo: `src/app/api/auth/logout/route.ts`** (novo)

```typescript
import { signOut } from "next-auth/react";
import { NextResponse } from "next/server";

export async function POST() {
  await signOut({ redirect: false });
  return NextResponse.json({ message: "Logout realizado com sucesso" });
}
```

---

### Fase 7: Adicionar Botão de Logout no Dashboard

**Arquivo: `src/app/dashboard/page.tsx`** (atualizar)

Adicionar função de logout:

```typescript
const handleLogout = async () => {
  await signOut({ redirect: true, callbackUrl: "/login" });
};

// No JSX:
<button onClick={handleLogout} className="...">
  Logout
</button>
```

---

### Fase 8: Validar Fluxo de Autenticação

**Checklist de Testes:**

1. ✅ Acessar `/login` sem autenticação
2. ✅ Fazer login com credenciais do `.env`
3. ✅ Ser redirecionado para `/dashboard`
4. ✅ Acessar `/dashboard` sem autenticação redireciona para `/login`
5. ✅ Fazer logout limpa a sessão
6. ✅ Requisições POST/DELETE para `/api/veiculos` sem autenticação retornam 401
7. ✅ Requisições GET para `/api/veiculos` funcionam sem autenticação (público)

---

## Resumo das Mudanças Necessárias

| Arquivo | Ação | Prioridade |
|---------|------|-----------|
| `src/middleware.ts` | Expandir proteção para API | 🔴 Alta |
| `src/lib/auth.ts` | Criar novo | 🔴 Alta |
| `src/app/api/veiculos/route.ts` | Adicionar validação | 🔴 Alta |
| `src/app/api/veiculos/[id]/route.ts` | Adicionar validação | 🔴 Alta |
| `src/app/api/auth/logout/route.ts` | Criar novo | 🟡 Média |
| `src/app/dashboard/page.tsx` | Adicionar logout | 🟡 Média |
| `.env` | Verificar variáveis | 🟢 Baixa |

---

## Comandos para Executar

```bash
# 1. Instalar dependências (se necessário)
npm install

# 2. Executar seed do banco
npx prisma db seed

# 3. Iniciar servidor de desenvolvimento
npm run dev

# 4. Testar em http://localhost:3000
```

---

## Notas Importantes

- As credenciais estão no `.env` e **nunca devem ser commitadas** no Git
- O `.env` deve estar no `.gitignore`
- A senha é hasheada com bcrypt (10 rounds) no seed
- O NextAuth gerencia a sessão com JWT
- Todas as rotas de modificação (POST, PUT, DELETE) devem ser protegidas
- Rotas de leitura (GET) podem ser públicas ou protegidas conforme necessário


import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function checkApiKey(supabase: any, req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '').replace('ApiKey ', '');
    if (token) {
      const { data: apiToken, error } = await supabase
        .from('ApiToken')
        .select('id')
        .eq('token', token)
        .eq('ativo', true)
        .single();

      if (apiToken && !error) {
        return true;
      }
    }
  }
  return false;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Proteção para rotas de API
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const hasApiKey = await checkApiKey(supabase, req);
    if (!hasApiKey && !session) {
      return new NextResponse(
        JSON.stringify({ error: 'Não autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return res;
  }

  // Se o usuário não estiver logado e não estiver na página de login, redireciona para o login
  if (!session && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Se o usuário estiver logado e tentar acessar a home, redireciona para o dashboard
  if (session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/veiculos',
    '/veiculos/:path*',
    '/api-tokens',
    '/api/veiculos/:path*',
    '/api/api-tokens/:path*',
  ],
};

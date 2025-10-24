## Plano de Integração com Supabase

Esta seção detalha os passos para integrar a aplicação com o Supabase, aproveitando seus recursos de backend como serviço.

1.  **Criação do Projeto no Supabase:**
    *   Acesse o site do [Supabase](https://supabase.com/) e crie uma nova conta ou faça login.
    *   Crie um novo projeto. Guarde a URL do projeto e as chaves de API (pública e de serviço).

2.  **Configuração do Banco de Dados no Supabase:**
    *   Navegue até a seção "Database" do seu projeto no Supabase.
    *   Você pode criar suas tabelas diretamente pela interface do Supabase ou usar o Prisma (veja o passo 4).

3.  **Instalação do Cliente Supabase:**
    *   Adicione o cliente Supabase ao seu projeto:
        ```bash
        npm install @supabase/supabase-js
        ```

4.  **Conexão com o Banco de Dados Supabase via Prisma:**
    *   Vá para a seção "Database" do seu projeto Supabase e encontre a string de conexão do PostgreSQL.
    *   Configure o arquivo `.env` com a string de conexão do Supabase:
        ```
        DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[AWS-REGION].pooler.supabase.com:6543/postgres"
        ```
    *   Execute as migrações do Prisma para criar suas tabelas no banco de dados do Supabase:
        ```bash
        npx prisma migrate dev
        ```

5.  **Atualização do Código da Aplicação para Usar o Supabase:**
    *   Crie um cliente Supabase em um arquivo de configuração (ex: `src/lib/supabaseClient.ts`):
        ```typescript
        import { createClient } from '@supabase/supabase-js';

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        export const supabase = createClient(supabaseUrl, supabaseAnonKey);
        ```
    *   Adicione as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` ao seu arquivo `.env.local`.
    *   Refatore seu código para usar o `supabase` client para autenticação, armazenamento de arquivos e outras funcionalidades do Supabase.
    *   Para operações de banco de dados, você pode continuar usando o Prisma Client ou usar o Supabase-js.

6.  **Testes:**
    *   Teste a integração completa, incluindo autenticação, acesso ao banco de dados e outras funcionalidades do Supabase que você tenha implementado.

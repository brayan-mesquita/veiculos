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

## Plano de Autenticação

1.  **Modelo de Administrador:**
    *   Criar um `model` de administrador no `prisma/schema.prisma` com `id`, `username` e `password`.
    *   Executar `prisma migrate` para atualizar o banco de dados.

2.  **Usuário Administrador Único:**
    *   Não haverá rota de registro pública.
    *   As credenciais do administrador (`ADMIN_USER` e `ADMIN_PASSWORD`) serão fornecidas através de variáveis de ambiente.
    *   Um script de "seed" do Prisma será criado para popular o banco de dados com o usuário administrador, armazenando a senha com hash (`bcrypt`).

3.  **Lógica de Login:**
    *   Criar uma rota de API apenas para login (`/api/auth/login`).
    *   A rota de login validará as credenciais, comparará o hash da senha e gerará um token JWT.
    *   `next-auth` será usado para gerenciar a sessão.

4.  **Proteção de Rotas:**
    *   As rotas que necessitam de autenticação serão protegidas.
    *   Usuários não autenticados serão redirecionados para a página de login.
    *   Apenas a página de login será criada (sem página de registro).

## Plano de Upload de Fotos com Supabase Storage

1.  **Configuração do Supabase Storage:**
    *   No painel do Supabase, criar um novo "Bucket" para armazenar as imagens dos veículos.
    *   Definir as políticas de acesso do bucket (por exemplo, permitir uploads para usuários autenticados).

2.  **Criação da Rota de API para Upload:**
    *   Criar uma nova rota de API (ex: `/api/veiculos/[id]/upload-foto`) para lidar com o upload de imagens.
    *   Nesta rota, receber o arquivo da imagem do frontend.
    *   Usar o cliente `@supabase/supabase-js` para fazer o upload do arquivo para o bucket criado.
    *   Após o upload, obter a URL pública da imagem.

3.  **Atualização do Modelo de Veículo:**
    *   Adicionar um campo `imageUrl` (ou similar) ao modelo `Veiculo` no `schema.prisma`.
    *   Executar uma nova migração do Prisma.

4.  **Atualização da Lógica da Aplicação:**
    *   Na rota de upload, salvar a URL da imagem no campo `imageUrl` do veículo correspondente no banco de dados.
    *   No frontend, criar um formulário que permita ao usuário selecionar e enviar uma imagem.
    *   Exibir a imagem do veículo nas páginas da aplicação.
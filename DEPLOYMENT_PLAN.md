# Plano de Deploy para EasyPanel

Este plano descreve os passos para fazer o deploy da aplicação de veículos no EasyPanel, seguindo o guia oficial para Next.js.

## Pré-requisitos

- Conta no EasyPanel
- Repositório GitHub com o código da aplicação
- Aplicação Next.js operacional (como a atual)

## Passos de Deploy

### 1. Preparar a Aplicação

#### 1.1 Configurar Variáveis de Ambiente

Certifique-se de que o arquivo `.env` está configurado com as variáveis necessárias. No EasyPanel, essas serão definidas na aba "Environment".

Exemplo de variáveis:

```env
DATABASE_URL="postgresql://username:password@db_host:5432/veiculos_db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"
```

#### 1.2 Atualizar Dockerfile para Migrações

Para garantir que as migrações do Prisma sejam executadas no deploy, atualize o Dockerfile para incluir o comando de deploy das migrações antes de iniciar a aplicação.

Adicione ao final do Dockerfile (antes do CMD):

```dockerfile
# Run Prisma migrations
RUN npx prisma migrate deploy

# Generate Prisma client (if not already done)
RUN npx prisma generate
```

O Dockerfile completo deve ser algo como:

```dockerfile
# Use the official Node.js image
FROM node:18-alpine

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Run Prisma migrations
RUN npx prisma migrate deploy

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

#### 1.3 Commit e Push para GitHub

Certifique-se de que todas as mudanças (incluindo o Dockerfile atualizado) estão commitadas e pushadas para o repositório GitHub.

### 2. Configurar no EasyPanel

#### 2.1 Criar um Novo Projeto

1. Faça login no EasyPanel.
2. Clique em "New" para criar um novo projeto.
3. Forneça um nome para o projeto (ex: "veiculos-app").
4. Clique em "Create" para completar o processo.

#### 2.2 Configurar o Serviço da Aplicação

1. No dashboard do projeto, clique em "+ Service".
2. Selecione "App" como o tipo de serviço.

#### 2.3 Configurar a Fonte Git/GitHub

1. Na seção "Source", selecione "GitHub" (ou "Git" se aplicável).
2. Configure:
   - Owner: Seu nome de usuário ou organização no GitHub.
   - Repository: Nome do repositório (ex: "api-veiculos").
   - Branch: "main" (ou a branch principal).
   - Build Path: "/" (raiz do repositório).
3. Salve as configurações.

#### 2.4 Escolher o Método de Build

1. Vá para a aba "Build".
2. Escolha entre "Nixpacks" (recomendado para detecção automática) ou "Dockerfile" (se preferir usar o Dockerfile personalizado).
3. Se usar Dockerfile, especifique o caminho relativo para o Dockerfile (geralmente "./Dockerfile").
4. Configure conforme necessário e salve.
5. Clique em "Deploy" para iniciar o processo de deployment.

#### 2.5 Configurar Variáveis de Ambiente

1. Navegue para a aba "Environment" no serviço da aplicação.
2. Defina as variáveis de ambiente necessárias (ex: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL).
3. Salve as mudanças.
4. Pressione "Deploy" para aplicar as configurações.

#### 2.6 Criar Banco de Dados PostgreSQL (se necessário)

Se o banco ainda não estiver configurado:

1. No EasyPanel, vá para "Databases" > "Add Database".
2. Selecione PostgreSQL.
3. Configure nome do banco: `veiculos_db`.
4. Anote as credenciais (host, port, username, password) e use no DATABASE_URL.

### 3. Acessar e Testar a Aplicação

1. Uma vez que o deployment esteja completo, a aplicação estará acessível via a URL pública gerada pelo EasyPanel.
2. Acesse a aplicação no domínio configurado.
3. Teste o login com as credenciais do admin (definidas no seed).
4. Verifique se os veículos são listados.
5. Teste a API com tokens.

### 4. Troubleshooting

- **Erro de Banco**: Verifique se o DATABASE_URL está correto e o banco está acessível. Certifique-se de que as migrações foram executadas.
- **Erro de Build**: Verifique se o Dockerfile está correto e todas as dependências estão instaladas.
- **Erro de Autenticação**: Verifique NEXTAUTH_SECRET e NEXTAUTH_URL.
- **Problemas com Migrações**: Confirme se o comando `npx prisma migrate deploy` está no Dockerfile e se o schema está correto.

### 5. Manutenção

- Para atualizações, commit e push as mudanças para o GitHub. O EasyPanel pode ser configurado para auto-deploy.
- Monitore logs no EasyPanel.
- Backup do banco regularmente via EasyPanel.
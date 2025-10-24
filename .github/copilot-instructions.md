# Instruções para Agentes de IA - Sistema de Gerenciamento de Veículos

Este documento fornece orientações essenciais para agentes de IA trabalharem neste projeto Next.js/TypeScript de gerenciamento de veículos.

## Arquitetura e Estrutura

### Frontend (Next.js App Router)
- `/src/app/`: Páginas e rotas usando o novo App Router do Next.js 14
  - `page.tsx`: Dashboard principal
  - `/veiculos/`: CRUD de veículos
  - `/api/`: Endpoints REST

### Backend e Dados
- SQLite + Drizzle ORM
- Modelo principal em `/src/lib/db/schema.ts`
- Inicialização do banco em `/src/lib/db/index.ts`

### Componentes e Temas
- Tailwind CSS para estilos com sistema de tema claro/escuro
- Componentes reutilizáveis em `/src/components/`
- Variáveis de tema em `/src/app/globals.css`

## Padrões e Convenções

### Estrutura de Dados
```typescript
interface Veiculo {
  id: number;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  quilometragem: number;
  preco: number;
  fotos: string[];
  descricao?: string;
  placa?: string;
  chassi?: string;
  combustivel?: string;
  cambio?: string;
  status: "disponivel" | "vendido" | "reservado" | "manutencao";
}
```

### API REST
- Endpoints base: `/api/veiculos`
- Validação de campos obrigatórios em POST/PUT
- Tratamento consistente de erros com NextResponse

### Estilo e UI
- Estilo baseado em classes Tailwind
- Tema consistente usando variáveis CSS personalizadas
- Componentes base com estados de loading
- Gráficos usando Recharts

## Fluxos de Desenvolvimento

1. Executar o projeto:
```bash
npm install
npm run dev
```

2. Banco de dados:
- SQLite local em `veiculos.db`
- Dados de exemplo são inseridos automaticamente
- Schema definido usando Drizzle ORM

3. Arquivos a verificar ao fazer mudanças:
- Alterações no modelo: `src/lib/db/schema.ts`
- Novas rotas API: `src/app/api/veiculos/`
- Novos componentes UI: `src/components/`
- Alterações de tema: `src/app/globals.css`

## Pontos de Integração

### Tema Claro/Escuro
- Gerenciado pelo `ThemeProvider` em `src/components/theme-provider.tsx`
- Alternado pelo `ThemeToggle` em `src/components/theme-toggle.tsx`
- Classes do Tailwind com variantes dark:

### Gráficos e Visualizações
- Recharts para gráficos no dashboard
- Dados processados em tempo real das APIs
- Formatação consistente de valores (preços, números)

### Estado e Dados
- Fetch API para chamadas HTTP
- useState/useEffect para gerenciamento de estado
- Tratamento de loading states em todas as páginas

## Práticas Importantes

1. Validação de Dados:
- Campos obrigatórios em formulários
- Tipagem forte com TypeScript
- Tratamento de erros da API

2. Performance:
- Lazy loading de componentes pesados
- Otimização de queries do banco
- Uso de cache quando apropriado

3. UX:
- Feedback visual para ações do usuário
- Estados de loading bem definidos
- Mensagens de erro claras

## Roadmap Técnico
- Upload de fotos
- Busca avançada de veículos
- Sistema de autenticação
- Relatórios avançados

## Debugging
- Verificar console para erros
- Logs detalhados nas rotas API
- Banco de dados em `veiculos.db` na raiz
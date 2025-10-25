# Sistema de Gerenciamento de Veículos

Sistema para gerenciar estoque de veículos de uma empresa, permitindo o cadastro, atualização, visualização e exclusão de veículos, além de um dashboard com estatísticas.

## Funcionalidades

- Cadastro completo de veículos (modelo, marca, ano, cor, quilometragem, preço, etc.)
- Listagem de veículos com opções de edição e exclusão
- Dashboard com estatísticas e gráficos
- API REST para consumo dos dados
- Tema claro/escuro

## Tecnologias Utilizadas

- Next.js
- TypeScript
- Tailwind CSS
- SQLite (banco de dados)
- Drizzle ORM
- Lucide Icons
- Recharts (gráficos)

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse o sistema em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

- `/src/app`: Páginas e rotas da aplicação
- `/src/app/api`: Endpoints da API REST
- `/src/components`: Componentes reutilizáveis
- `/src/lib/db`: Configuração do banco de dados e modelos

## API Endpoints

- `GET /api/veiculos`: Lista todos os veículos
- `POST /api/veiculos`: Cria um novo veículo
- `GET /api/veiculos/:id`: Obtém um veículo específico
- `PUT /api/veiculos/:id`: Atualiza um veículo
- `DELETE /api/veiculos/:id`: Remove um veículo

## Modelo de Dados

O sistema armazena as seguintes informações sobre os veículos:

- Modelo
- Marca
- Ano
- Cor
- Quilometragem
- Preço
- Fotos (URLs)
- Descrição
- Placa
- Chassi
- Combustível
- Câmbio
- Status (disponível, vendido, etc.)

## Próximos Passos

- Implementação do upload de fotos
- Funcionalidade de busca avançada
- Relatórios de vendas
- Autenticação de usuários
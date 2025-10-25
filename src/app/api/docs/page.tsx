import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Documentação da API</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Voltar ao Dashboard
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">API RESTful de Veículos</h2>
            <p className="text-muted-foreground">
              Esta API permite gerenciar o inventário de veículos com operações CRUD completas.
              Todas as respostas são retornadas no formato JSON.
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Autenticação</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                Todas as rotas da API exigem autenticação. Use um token de API válido no header:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm mt-2">
                Authorization: Bearer seu-token-aqui
              </pre>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                Ou:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                Authorization: ApiKey seu-token-aqui
              </pre>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                Gerencie seus tokens de API na seção <Link href="/api-tokens" className="underline">Tokens de API</Link>.
              </p>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Endpoint GET /api/veiculos */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">GET</span>
                <code className="text-sm font-mono">/api/veiculos</code>
              </div>
              <h3 className="text-xl font-semibold mb-2">Listar todos os veículos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Retorna uma lista de todos os veículos cadastrados no sistema.
              </p>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Exemplo de resposta</h4>
                <pre className="bg-muted/50 rounded-md p-4 overflow-x-auto text-xs">
{`[
  {
    "id": 1,
    "modelo": "Civic",
    "marca": "Honda",
    "ano": 2022,
    "cor": "Prata",
    "quilometragem": 15000,
    "preco": 120000,
    "fotos": ["url1.jpg", "url2.jpg"],
    "descricao": "Veículo em excelente estado",
    "placa": "ABC1234",
    "chassi": "9BWHE21JX24060831",
    "combustivel": "Flex",
    "cambio": "Automático",
    "status": "disponivel",
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-01-15T10:30:00Z"
  },
  // ...
]`}
                </pre>
              </div>
            </div>
            
            {/* Endpoint POST /api/veiculos */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">POST</span>
                <code className="text-sm font-mono">/api/veiculos</code>
              </div>
              <h3 className="text-xl font-semibold mb-2">Criar um novo veículo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Cadastra um novo veículo no sistema.
              </p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Corpo da requisição</h4>
                <pre className="bg-muted/50 rounded-md p-4 overflow-x-auto text-xs">
{`{
  "modelo": "Civic",
  "marca": "Honda",
  "ano": 2022,
  "cor": "Prata",
  "quilometragem": 15000,
  "preco": 120000,
  "fotos": ["url1.jpg", "url2.jpg"],
  "descricao": "Veículo em excelente estado",
  "placa": "ABC1234",
  "chassi": "9BWHE21JX24060831",
  "combustivel": "Flex",
  "cambio": "Automático",
  "status": "disponivel"
}`}
                </pre>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Exemplo de resposta</h4>
                <pre className="bg-muted/50 rounded-md p-4 overflow-x-auto text-xs">
{`{
  "id": 1,
  "modelo": "Civic",
  "marca": "Honda",
  "ano": 2022,
  "cor": "Prata",
  "quilometragem": 15000,
  "preco": 120000,
  "fotos": ["url1.jpg", "url2.jpg"],
  "descricao": "Veículo em excelente estado",
  "placa": "ABC1234",
  "chassi": "9BWHE21JX24060831",
  "combustivel": "Flex",
  "cambio": "Automático",
  "status": "disponivel",
  "createdAt": "2023-01-15T10:30:00Z",
  "updatedAt": "2023-01-15T10:30:00Z"
}`}
                </pre>
              </div>
            </div>
            
            {/* Endpoint GET /api/veiculos/[id] */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">GET</span>
                <code className="text-sm font-mono">/api/veiculos/{'{id}'}</code>
              </div>
              <h3 className="text-xl font-semibold mb-2">Obter um veículo específico</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Retorna os detalhes de um veículo específico pelo ID.
              </p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Parâmetros de rota</h4>
                <div className="bg-muted/50 rounded-md p-4">
                  <ul className="space-y-2 text-sm">
                    <li><code>id</code> - ID do veículo (obrigatório)</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Exemplo de resposta</h4>
                <pre className="bg-muted/50 rounded-md p-4 overflow-x-auto text-xs">
{`{
  "id": 1,
  "modelo": "Civic",
  "marca": "Honda",
  "ano": 2022,
  "cor": "Prata",
  "quilometragem": 15000,
  "preco": 120000,
  "fotos": ["url1.jpg", "url2.jpg"],
  "descricao": "Veículo em excelente estado",
  "placa": "ABC1234",
  "chassi": "9BWHE21JX24060831",
  "combustivel": "Flex",
  "cambio": "Automático",
  "status": "disponivel",
  "createdAt": "2023-01-15T10:30:00Z",
  "updatedAt": "2023-01-15T10:30:00Z"
}`}
                </pre>
              </div>
            </div>
            
            {/* Endpoint PUT /api/veiculos/[id] */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 text-xs font-semibold rounded-md bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">PUT</span>
                <code className="text-sm font-mono">/api/veiculos/{'{id}'}</code>
              </div>
              <h3 className="text-xl font-semibold mb-2">Atualizar um veículo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Atualiza os dados de um veículo existente.
              </p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Parâmetros de rota</h4>
                <div className="bg-muted/50 rounded-md p-4">
                  <ul className="space-y-2 text-sm">
                    <li><code>id</code> - ID do veículo (obrigatório)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Corpo da requisição</h4>
                <pre className="bg-muted/50 rounded-md p-4 overflow-x-auto text-xs">
{`{
  "modelo": "Civic",
  "marca": "Honda",
  "ano": 2022,
  "cor": "Azul",
  "quilometragem": 18000,
  "preco": 115000,
  "fotos": ["url1.jpg", "url2.jpg"],
  "descricao": "Veículo em excelente estado, revisado",
  "placa": "ABC1234",
  "chassi": "9BWHE21JX24060831",
  "combustivel": "Flex",
  "cambio": "Automático",
  "status": "disponivel"
}`}
                </pre>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Exemplo de resposta</h4>
                <pre className="bg-muted/50 rounded-md p-4 overflow-x-auto text-xs">
{`{
  "id": 1,
  "modelo": "Civic",
  "marca": "Honda",
  "ano": 2022,
  "cor": "Azul",
  "quilometragem": 18000,
  "preco": 115000,
  "fotos": ["url1.jpg", "url2.jpg"],
  "descricao": "Veículo em excelente estado, revisado",
  "placa": "ABC1234",
  "chassi": "9BWHE21JX24060831",
  "combustivel": "Flex",
  "cambio": "Automático",
  "status": "disponivel",
  "createdAt": "2023-01-15T10:30:00Z",
  "updatedAt": "2023-02-20T14:15:00Z"
}`}
                </pre>
              </div>
            </div>
            
            {/* Endpoint DELETE /api/veiculos/[id] */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">DELETE</span>
                <code className="text-sm font-mono">/api/veiculos/{'{id}'}</code>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excluir um veículo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Remove um veículo do sistema.
              </p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Parâmetros de rota</h4>
                <div className="bg-muted/50 rounded-md p-4">
                  <ul className="space-y-2 text-sm">
                    <li><code>id</code> - ID do veículo (obrigatório)</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Exemplo de resposta</h4>
                <pre className="bg-muted/50 rounded-md p-4 overflow-x-auto text-xs">
{`{
  "message": "Veículo excluído com sucesso"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
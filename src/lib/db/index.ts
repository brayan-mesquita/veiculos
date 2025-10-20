import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({ url: "file:veiculos.db" });
export const db = drizzle(client, { schema });

export async function initializeDatabase() {
  // Cria a tabela de veículos se não existir
  await client.execute(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      modelo TEXT NOT NULL,
      marca TEXT NOT NULL,
      ano INTEGER NOT NULL,
      cor TEXT NOT NULL,
      quilometragem INTEGER NOT NULL,
      preco INTEGER NOT NULL,
      fotos TEXT DEFAULT '[]',
      descricao TEXT,
      placa TEXT,
      chassi TEXT,
      combustivel TEXT,
      cambio TEXT,
      status TEXT DEFAULT 'disponivel',
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
  `);
  
  // Insere dados de exemplo se a tabela estiver vazia
  const countResult = await client.execute("SELECT COUNT(*) as count FROM veiculos");
  
  if (countResult.rows.length > 0 && (countResult.rows[0] as any).count === 0) {
    // Dados de exemplo
    const veiculosExemplo = [
      {
        modelo: "Civic",
        marca: "Honda",
        ano: 2022,
        cor: "Preto",
        quilometragem: 15000,
        preco: 120000,
        descricao: "Honda Civic Touring em excelente estado",
        combustivel: "Flex",
        cambio: "Automático"
      },
      {
        modelo: "Corolla",
        marca: "Toyota",
        ano: 2021,
        cor: "Branco",
        quilometragem: 25000,
        preco: 110000,
        descricao: "Toyota Corolla XEI completo",
        combustivel: "Flex",
        cambio: "Automático"
      },
      {
        modelo: "Compass",
        marca: "Jeep",
        ano: 2023,
        cor: "Cinza",
        quilometragem: 5000,
        preco: 180000,
        descricao: "Jeep Compass Limited, teto solar panorâmico",
        combustivel: "Diesel",
        cambio: "Automático"
      }
    ];
    
    for (const veiculo of veiculosExemplo) {
      await client.execute({
        sql: "INSERT INTO veiculos (modelo, marca, ano, cor, quilometragem, preco, descricao, combustivel, cambio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: [
          veiculo.modelo,
          veiculo.marca,
          veiculo.ano,
          veiculo.cor,
          veiculo.quilometragem,
          veiculo.preco,
          veiculo.descricao,
          veiculo.combustivel,
          veiculo.cambio
        ]
      });
    }
  }
}
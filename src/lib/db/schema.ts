import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const veiculos = sqliteTable("veiculos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  modelo: text("modelo").notNull(),
  marca: text("marca").notNull(),
  ano: integer("ano").notNull(),
  cor: text("cor").notNull(),
  quilometragem: integer("quilometragem").notNull(),
  preco: integer("preco").notNull(),
  fotos: text("fotos", { mode: "json" }).default("[]"),
  descricao: text("descricao"),
  placa: text("placa"),
  chassi: text("chassi"),
  combustivel: text("combustivel"),
  cambio: text("cambio"),
  status: text("status").default("disponivel"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});
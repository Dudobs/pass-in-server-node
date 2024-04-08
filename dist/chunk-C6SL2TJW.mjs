// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient({
  // Cria conexão com o banco de dados
  log: ["query"]
  // Mostra um log a cada query que for feita ao banco
});

export {
  prisma
};

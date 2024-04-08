// Arquivo com a conexão do banco de dados, que vamos usar em todas as rotas
import { PrismaClient } from "@prisma/client"; // Inserir dados no banco

export const prisma = new PrismaClient({ // Cria conexão com o banco de dados
  log: ['query'], // Mostra um log a cada query que for feita ao banco
})
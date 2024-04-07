import fastify from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client'; // Inserir dados no banco

const prisma = new PrismaClient({ // Cria conexão com o banco de dados
  log: ['query'], // Mostra um log a cada query que for feita ao banco
})

const app = fastify()

app.post('/events', async (request, reply) => { // request = dados recebidos | reply = como devolver a resposta pro front-end
  const createEventSchema = z.object({ // Informamos ao zod que o formato de dados que passamos na requisição, nesse caso é um objeto
    // Após isso, declaramos o corpo que essa requisição deve ter e suas especificações
    title: z.string().min(4), // O titulo é uma string e deve conter no mínimo 4 caracteres
    details: z.string().nullable(), // Os detalhes podem ser nulos
    maximumAttendess: z.number().int().positive().nullable(), // Esse campo além de um número, deve ser inteiro, positivo e pode ser nulo
  })

  const data = createEventSchema.parse(request.body) // Valida os dados. Pega o corpo da requisição e verifica se segue suas devidas especificações 

  const event = await prisma.event.create({ // Processo de criação de um evento 
    // Está função é uma promessa, logo usamos o await antes da mesma, assim ela espera o fim da execução da função, antes de prosseguir com o código, mas para isso, devemos declarar que temos promessas na função pai da promessa escrevendo 'async' antes da mesma
    data: {
      title: data.title,
      details: data.details,
      maximumAttendees: data.maximumAttendess,
      slug: new Date().toISOString(),
    }
  })

  return reply.status(201).send({ eventId: event.id })
})

app.listen({ port: 5555 }).then(() => {
  console.log('HTTP server running')
}) 
// Coloca o porjeto no ar e define a porta da aplicação
// Sempre que vamos  fazer alguma ação que possa demorar um tempo para executar, chamamos essa ação de "promisse". O .then() nos avisa quando essa ação dá certo, executando uma função
import { z } from "zod"
import { ZodTypeProvider } from "fastify-type-provider-zod"

import { generateSlug } from "../utils/generate-slug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { BadRequest } from "./_errors/bad-request"

export async function createEvent(app: FastifyInstance) { // Ao passar o mouse em cima do nosso app no arquivo 'server.ts', podemos ver o seu tipo (FastifyInstance)
  // O Fastify, pede por padrão, que toda e qualquer função que separe a aplicação em vários arquivos, sejam assincrónas
  app.withTypeProvider<ZodTypeProvider>()
    .post('/events', {
      schema: { // Criamos um esquema que vai validar TODOS os dados recebidos e retornados da rota
        summary: 'Create an event',
        tags: ['events'],
        body: z.object({ // Informamos ao zod que o formato de dados que passamos na requisição, nesse caso é um objeto
          // Após isso, declaramos o corpo que essa requisição deve ter e suas especificações
          title: z.string().min(4), // O titulo é uma string e deve conter no mínimo 4 caracteres
          details: z.string().nullable(), // Os detalhes podem ser nulos
          maximumAttendees: z.number().int().positive().nullable(), // Esse campo além de um número, deve ser inteiro, positivo e pode ser nulo
        }),
        response: {
          201: z.object({ // Declara que a resposta da requisição retorna uma String no formato UUID
            eventId: z.string().uuid(),
          }),
        },
      }
    }, async (request, reply) => { // request = dados recebidos | reply = como devolver a resposta pro front-end
        const { // Desestruturando o obejto. De dentro do request.body, eu pego title, details...
          title,
          details,
          maximumAttendees,
        } = request.body // Valida os dados. Pega o corpo da requisição e verifica se segue suas devidas especificações 

      const slug = generateSlug(title)

      const eventWithSameSlug = await prisma.event.findUnique({ // Ao tentar criar um novo evento, verifica se na tabela já há uma coluna com o mesmo slug(title)
        where: {
          slug, // O mesmo que slug(coluna do banco) === slug(dado da nova requisição)
        }
      })

      if (eventWithSameSlug !== null) {
        throw new BadRequest('Another event with same title already exists') // Erro do tipo Bad Request -> '_errors/bad-request.ts'
      }

      const event = await prisma.event.create({ // Processo de criação de um evento 
        // Está função é uma promessa, logo usamos o await antes da mesma, assim ela espera o fim da execução da função, antes de prosseguir com o código, mas para isso, devemos declarar que temos promessas na função pai da promessa escrevendo 'async' antes da mesma
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      })

      return reply.status(201).send({ eventId: event.id })
    })
  }


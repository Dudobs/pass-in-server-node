import {
  prisma
} from "./chunk-C6SL2TJW.mjs";

// src/routes/get-event-attendees.ts
import { z } from "zod";
async function getEventsAttendees(app) {
  app.withTypeProvider().get("/events/:eventId/attendees", {
    schema: {
      summary: "Get event attendes",
      tags: ["events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      querystring: z.object({
        // Tipagem da query 'pageIndex'
        query: z.string().nullish(),
        // Nullish define o dado como podendo ser null ou undefined
        pageIndex: z.string().nullish().default("0").transform(Number)
        // String (vai estar na URL), pode ser nula, valor default 0 (página 1). Convertido para um número
      }),
      response: {
        200: z.object({
          attendees: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              email: z.string().email(),
              createdAt: z.date(),
              checkedInAt: z.date().nullable()
            })
          )
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { pageIndex, query } = request.query;
    const attendees = await prisma.attendee.findMany({
      // Queremos encontrar vários participantes (.findMany())
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        checkIn: {
          select: {
            createdAt: true
          }
        }
      },
      where: query ? {
        eventId,
        name: {
          contains: query
        }
      } : {
        eventId
      },
      // Esquema de paginação
      take: 10,
      // A requisição vai retornar 10 registros
      skip: pageIndex * 10,
      // E pular o índice da página, vezes 10, logo, se o usuário estiver na página 1 (index = 0), nenhum registro será pulado. Se ele estiver na página 2 (index = 1, 1*10), 10 registros serão pulados, e assim por diante
      orderBy: {
        // Ordena o resultado da lista de acordo com a data de registro do participante ao evento
        createdAt: "desc"
      }
    });
    return reply.send({
      attendees: attendees.map((attendee) => {
        return {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          createdAt: attendee.createdAt,
          checkedInAt: attendee.checkIn?.createdAt ?? null
          // O check in pode ser nulo, logo o dado só é retornado se existir
        };
      })
    });
  });
}

export {
  getEventsAttendees
};

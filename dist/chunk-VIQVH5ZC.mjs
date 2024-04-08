import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-C6SL2TJW.mjs";

// src/routes/get-events.ts
import { z } from "zod";
async function getEvents(app) {
  app.withTypeProvider().get("/events/:eventId", {
    schema: {
      summary: "Get an event",
      tags: ["events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        200: z.object(
          {
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              attendeesAmount: z.number().int()
            })
          }
        )
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const event = await prisma.event.findUnique({
      select: {
        // Seleciona as colunas específicas da ta tabela que eu quero buscar
        id: true,
        title: true,
        slug: true,
        details: true,
        maximumAttendees: true,
        _count: {
          // Busca a quantidade de participantes registrados no evento pelo relacionamento inverso do Prisma na tabela events
          select: {
            attendees: true
          }
        }
      },
      where: {
        id: eventId
      }
    });
    if (event === null) {
      throw new BadRequest("Event not found.");
    }
    return reply.send({
      event: {
        // Cria um objeto personalizado para retornar as informações ao frot-end
        id: event.id,
        title: event.title,
        slug: event.slug,
        details: event.details,
        maximumAttendees: event.maximumAttendees,
        attendeesAmount: event._count.attendees
      }
    });
  });
}

export {
  getEvents
};

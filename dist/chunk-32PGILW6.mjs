import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-C6SL2TJW.mjs";

// src/routes/get-attendee-badge.ts
import { z } from "zod";
async function getAttendeeBadge(app) {
  app.withTypeProvider().get("/attendees/:attendeeId/badge", {
    schema: {
      summary: "Get an attendee badge",
      tags: ["attendees"],
      params: z.object({
        attendeeId: z.coerce.number().int()
        // Todo parãmetro de uma URL é passado como uma strin, então usamos o coerce para converter o número numa string
      }),
      response: {
        200: z.object({
          badge: z.object({
            name: z.string(),
            email: z.string().email(),
            eventTitle: z.string(),
            checkInURL: z.string().url()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const attendee = await prisma.attendee.findUnique({
      select: {
        name: true,
        email: true,
        event: {
          // Inclui informações do evento
          select: {
            title: true
          }
        }
      },
      where: {
        id: attendeeId
      }
    });
    if (attendee === null) {
      throw new BadRequest("Attendee not found.");
    }
    const baseURL = `${request.protocol}://${request.hostname}`;
    const checkInURL = new URL(`attendees/${attendeeId}/check-in`, baseURL);
    return reply.send({
      badge: {
        name: attendee.name,
        email: attendee.email,
        eventTitle: attendee.event.title,
        checkInURL: checkInURL.toString()
      }
    });
  });
}

export {
  getAttendeeBadge
};

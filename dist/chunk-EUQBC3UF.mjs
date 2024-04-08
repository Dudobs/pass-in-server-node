import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-C6SL2TJW.mjs";

// src/routes/register-for-event.ts
import { z } from "zod";
async function registerForEvent(app) {
  app.withTypeProvider().post("/events/:eventId/attendee", {
    // A melhor forma de enviar o Id do evento é pelos parâmetros de rota. Sintaxe: /:parâmetro
    schema: {
      summary: "Register an attendee",
      tags: ["attendees"],
      body: z.object({
        name: z.string().min(4),
        email: z.string().email()
      }),
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        201: z.object({
          attendeeId: z.number()
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { name, email } = request.body;
    const attendeeFromEmail = await prisma.attendee.findUnique({
      // Verifica se o email já está registrado no evento
      where: {
        eventId_email: {
          eventId,
          email
        }
      }
    });
    if (attendeeFromEmail !== null) {
      throw new BadRequest("This email is already registered for this event.");
    }
    const [event, amountOfAttendeesForEvent] = await Promise.all([
      // Quando temos duas promisses que não dependem uma da outra e podem ser executadas. 
      // Aqui a desestruturação também acontece, com a primeira promisse sendo event, a segunda amountOfAttendeesForEvent e adiante
      prisma.event.findUnique({
        where: {
          id: eventId
        }
      }),
      prisma.attendee.count({
        where: {
          eventId
        }
      })
    ]);
    if (event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees) {
      throw new BadRequest("The maximum number of attendees for this event has been reached");
    }
    const attendee = await prisma.attendee.create({
      data: {
        name,
        email,
        eventId
      }
    });
    return reply.status(201).send({ attendeeId: attendee.id });
  });
}

export {
  registerForEvent
};

// Tratamento de erros
import { FastifyInstance } from "fastify/types/instance";
import { BadRequest } from "./routes/_errors/bad-request";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) { // Caso o erro seja derivado do Zod
    return reply.status(400).send ({
      message: 'Error during validation',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequest) { // Caso o erro seja derivado do Bad Request -> '_errors/bad-request.ts'
    return reply.status(400).send({ message: error.message })
  }

  return reply.status(500).send({ message: 'Internal server error!' })
}


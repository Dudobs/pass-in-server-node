import {
  registerForEvent
} from "./chunk-EUQBC3UF.mjs";
import {
  errorHandler
} from "./chunk-DCZJQNPL.mjs";
import {
  checkIn
} from "./chunk-OTUJXCLB.mjs";
import {
  createEvent
} from "./chunk-2IJETU4S.mjs";
import "./chunk-2X2XB7AB.mjs";
import {
  getAttendeeBadge
} from "./chunk-32PGILW6.mjs";
import {
  getEventsAttendees
} from "./chunk-3GBXR26D.mjs";
import {
  getEvents
} from "./chunk-VIQVH5ZC.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-C6SL2TJW.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
  // Qualquer aplicação front-end
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    // Informo que todos os dados enviados serão no formato JSON
    produces: ["application/json"],
    // Assim como os dados a serem retornados (rotas GET)
    info: {
      // Informações da API
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in constru\xEDda durante o NLW Unite da Rocketseat.",
      version: "1.0.0"
    }
  },
  // O transform diz para o Swagger, como ele deve interpetar os esquemas de cada rota, suas tipagens. No nosso caso, isso foi feito com o Zod
  transform: jsonSchemaTransform
  // Importa o 'jsonSchemaTransform' from 'fastify-type-provider-zod' que diz para o Swagger que estamos usando o Zod para fazer a tipagem das rotas 
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
  // Ao acessar a rota 'localhost:8888/docs' abre a interface de documentação da API
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvents);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventsAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 8888, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running");
});

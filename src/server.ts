import fastify from 'fastify';

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors';

import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { createEvent } from './routes/create-event';
import { registerForEvent } from './routes/register-for-event';
import { getEvents } from './routes/get-events';
import { getAttendeeBadge } from './routes/get-attendee-badge';
import { checkIn } from './routes/check-in';
import { getEventsAttendees } from './routes/get-event-attendees';
import { errorHandler } from './error-handler';

const app = fastify()

// Configurando quais aplicações front-end podem consumir a API
app.register(fastifyCors, {
  origin: '*' // Qualquer aplicação front-end
})

// Criando documentação da API com Swagger
app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'], // Informo que todos os dados enviados serão no formato JSON
    produces: ['application/json'], // Assim como os dados a serem retornados (rotas GET)
    info: { // Informações da API
      title: 'pass.in',
      description: 'Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat.',
      version: '1.0.0'
    },
  },
  // O transform diz para o Swagger, como ele deve interpetar os esquemas de cada rota, suas tipagens. No nosso caso, isso foi feito com o Zod
  transform: jsonSchemaTransform // Importa o 'jsonSchemaTransform' from 'fastify-type-provider-zod' que diz para o Swagger que estamos usando o Zod para fazer a tipagem das rotas 
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs' // Ao acessar a rota 'localhost:8888/docs' abre a interface de documentação da API
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent) // 'create-event.ts'
app.register(registerForEvent)
app.register(getEvents)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(getEventsAttendees)

app.setErrorHandler(errorHandler) // Direciona todos os erros para essa função, que foi criada para o tratamento dos mesmos

app.listen({ port: 8888, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running')
}) 
// Coloca o porjeto no ar e define a porta da aplicação
// Sempre que vamos  fazer alguma ação que possa demorar um tempo para executar, chamamos essa ação de "promisse". O .then() nos avisa quando essa ação dá certo, executando uma função
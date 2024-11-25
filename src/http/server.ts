import fastify from 'fastify'
import fastifyCors from '@fastify/cors'

import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { errorHandler } from '@/http/routes/error-handler'
import { CreateUser } from './routes/users/create-users'
import { signInUser } from './routes/users/sign-in'
import { passwordRecover } from './routes/users/password-reset'
import { CreatePhoto } from './routes/photo/create-photo'
import multipart from '@fastify/multipart'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)
app.register(fastifyCors)
app.register(multipart)

app.get('/', () => {
  return 'Hello MUndo'
})

app.register(CreateUser)
app.register(signInUser)
app.register(passwordRecover)
app.register(CreatePhoto)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('server running in http://localhost:3333')
  })

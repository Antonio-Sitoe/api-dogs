import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { signJWT } from '@/lib/token'

const schema = z.object({
  username: z.string({
    required_error: 'O campo username é obrigatório',
  }),
  email: z
    .string({ required_error: 'O campo email é obrigatório' })
    .email('O campo email deve conter um valor valido'),
  password: z
    .string({ required_error: 'O campo password é obrigatório' })
    .min(6, 'O password deve ser maior de 6 digitos'),
})

export async function CreateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',

    async (request, reply) => {
      try {
        const { username, email, password } = schema.parse(request.body)

        const userExists = await prisma.user.findUnique({
          where: { email },
        })

        if (userExists) {
          return reply.status(409).send('E-mail já está em uso.')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
          data: {
            email,
            name: username,
            password: hashedPassword,
          },
        })

        const token = await signJWT({
          id: newUser.id,
          username: newUser.name,
        })

        return reply.status(201).send({
          user: {
            id: newUser.id,
            username: newUser.name,
            email: newUser.email,
          },
          token,
        })
      } catch (error) {
        console.error(error)
        return reply.status(500).send(error)
      }
    },
  )
}

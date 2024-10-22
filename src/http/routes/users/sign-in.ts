import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { compare } from 'bcrypt'
import { BadRequestError } from '../_errors/bad-request-error'
import { signJWT } from '../../../lib/token'

const schema = z.object({
  email: z
    .string({
      required_error: 'O campo email é obrigatório',
    })
    .email('O campo email deve conter um valor valido'),
  password: z.string({ required_error: 'O campo password é obrigatório' }),
})
export async function signInUser(app: FastifyInstance) {
  app.post('/sign-in', async (request, reply) => {
    try {
      const { email, password } = schema.parse(request.body)

      const userFinded = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!userFinded) {
        return reply.status(401).send({
          message: 'Email ou password invalidos',
        })
      }

      const passwordMatch = await compare(password, userFinded.password)

      if (!passwordMatch) {
        throw new BadRequestError('Password invalido')
      }

      const token = await signJWT({
        id: userFinded.id,
        username: userFinded.name,
      })

      return reply.status(200).send({
        token,
        email: userFinded.email,
        name: userFinded.name,
      })
    } catch (error) {
      return reply.status(400).send(error)
    }
  })
}

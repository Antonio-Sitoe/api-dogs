import { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'
import { auth } from '../middlewares/auth'

export async function me(app: FastifyInstance) {
  app.register(auth).get('/users/me', async (req, reply) => {
    try {
      const userId = (await req.getCurrentUserId()) as string

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })

      if (!user) {
        return reply.status(201).send()
      }

      return reply.status(200).send({
        user,
        message: 'Usuário encontrado',
      })
    } catch (error) {
      return reply.status(400).send(error)
    }
  })
}

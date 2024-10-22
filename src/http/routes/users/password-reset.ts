import { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'

import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { resendEmail } from '@/lib/resend'

const schema = z.object({
  email: z.string().email(),
})

export async function passwordRecover(app: FastifyInstance) {
  app.post('/password-recover', async (req, reply) => {
    try {
      const { email } = schema.parse(req.body)

      const userFinded = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!userFinded) {
        return reply.status(201).send()
      }

      const token = await prisma.token.create({
        data: {
          token: 'PASSWORD_RESET',
          userId: userFinded.id,
        },
      })

      const { data, error } = await resendEmail({
        email: userFinded.email,
        token: token.id,
      })

      if (error) {
        throw new BadRequestError(JSON.stringify(error))
      }

      return reply.status(200).send({
        token: data?.id || '',
        message: 'Email enviando com sucesso, verifique a tua conta',
      })
    } catch (error) {
      return reply.status(400).send(error)
    }
  })
}

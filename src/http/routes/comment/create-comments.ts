import '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

import { FastifyInstance } from 'fastify'
import { auth } from '../middlewares/auth'
import { z } from 'zod'

const schema = z.object({
  id: z.string({ required_error: 'Selecione uma foto' }),
})
const bodySchema = z.object({
  comment: z.string({ required_error: 'Campo vazio' }),
})

export function createComments(app: FastifyInstance) {
  app.register(auth).post('/comments/:id', async (req, reply) => {
    const userId = await req.getCurrentUserId()
    try {
      const { id } = schema.parse(await req.params)
      const { comment } = bodySchema.parse(req.body)
      const photoFinded = await prisma.photo.findUnique({
        where: { id },
      })
      if (!photoFinded) throw new Error('Foto nao encontrada')

      const data = await prisma.comments.create({
        data: {
          comment,
          photoId: id,
          userId: String(userId),
        },
      })

      return reply.send({
        success: true,
        data,
      })
    } catch (error) {
      console.error(error)
      return reply.status(500).send({
        error: 'Erro ao comentar',
        message: JSON.stringify(error),
      })
    }
  })
}

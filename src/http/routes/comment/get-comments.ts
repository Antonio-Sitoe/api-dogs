import '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const schema = z.object({
  id: z.string({ required_error: 'Selecione uma foto' }),
})

export function getComments(app: FastifyInstance) {
  app.get('/comments/:id', async (req, reply) => {
    await req.getCurrentUserId()
    try {
      const { id } = schema.parse(await req.params)
      const photoFinded = await prisma.photo.findUnique({
        where: { id },
      })
      if (!photoFinded) throw new Error('Foto nao encontrada')
      const data = await prisma.comments.findMany({
        where: {
          photoId: id,
        },
      })
      return reply.send({
        success: true,
        data,
      })
    } catch (error) {
      console.error(error)
      return reply.status(500).send({
        error: 'Erro na busca dos comentarios',
        message: JSON.stringify(error),
      })
    }
  })
}

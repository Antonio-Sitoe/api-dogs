import '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

import { FastifyInstance } from 'fastify'
import { auth } from '../middlewares/auth'

export function DeletePhoto(app: FastifyInstance) {
  app.register(auth).delete('/photo/:id', async (req, reply) => {
    await req.getCurrentUserId()
    try {
      const { id } = req.params as { id: string }
      await prisma.photo.delete({
        where: {
          id,
        },
      })
      return reply.send({ success: true, message: 'Foto deletada com sucesso' })
    } catch (error: { code: string }) {
      if (error.code === 'P2025') {
        // Código de erro "Registro não encontrado" do Prisma
        return reply.status(404).send({
          success: false,
          message: 'Foto não encontrada',
        })
      }

      console.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Erro ao processar a solicitação',
      })
    }
  })
}

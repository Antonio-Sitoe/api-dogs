import '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

import { FastifyInstance } from 'fastify'
import { BadRequestError } from '../_errors/bad-request-error'

export function getOnePhoto(app: FastifyInstance) {
  app.get('/photo/statics', async (req, reply) => {
    try {
      const userId = (await req.getCurrentUserId()) as string
      const data = await prisma.photo.findMany({
        where: { userId },
      })

      if (!data) {
        throw new BadRequestError('Photo not found')
      }

      const graphData = data.map((item) => {
        return {
          x: item.nome,
          y: Number(item.acessos),
        }
      })

      const total = data
        .map(({ acessos }) => Number(acessos))
        .reduce((a, b) => a + b, 0)

      return reply.send({ success: true, data: { total, statics: graphData } })
    } catch (error) {
      console.error(error)
      return reply.status(500).send({
        message: JSON.stringify(error),
      })
    }
  })
}

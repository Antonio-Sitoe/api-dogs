import '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

import { FastifyInstance } from 'fastify'

export function getAllPhotos(app: FastifyInstance) {
  app.get('/photo', async (req, reply) => {
    try {
      const {
        _total = 6,
        _page = 1,
        _user,
      } = req.query as {
        _total?: number
        _page?: number
        _user?: string
      }

      const total = parseInt(String(_total), 10)
      const page = parseInt(String(_page), 10)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filters: any = {}

      if (_user) {
        filters.userId = _user
      }

      const photos = await prisma.photo.findMany({
        where: filters,
        skip: (page - 1) * total,
        take: total,
        orderBy: { createdAt: 'asc' },
      })

      const count = await prisma.photo.count({
        where: filters,
      })

      return reply.send({
        success: true,
        data: {
          photos,
          pagination: {
            totalPages: Math.ceil(count / total),
            currentPage: page,
            totalItems: count,
          },
        },
      })
    } catch (error) {
      console.error(error)
      return reply.status(500).send({
        success: false,
        message: JSON.stringify(error),
      })
    }
  })
}

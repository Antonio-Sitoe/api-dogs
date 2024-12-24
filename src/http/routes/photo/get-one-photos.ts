import '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

const schema = z.object({
  id: z.string(),
})

export function getOnePhoto(app: FastifyInstance) {
  app.get('/photo/:id', async (req, reply) => {
    try {
      const { id } = schema.parse(await req.params)
      const data = await prisma.photo.findFirst({
        where: { id },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          Comments: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              id: true,
              comment: true,
              createdAt: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })
      if (!data) {
        throw new BadRequestError('Photo not found')
      }
      const acessos = (data?.acessos ?? 0) + 1
      await prisma.photo.update({
        where: {
          id,
        },
        data: {
          acessos,
        },
      })
      return reply.send({
        success: true,
        data: {
          ...data,
          acessos,
          author: data.user.name,
          comments: data.Comments.map((item) => ({
            comment_ID: item.id,
            comment_post_ID: id,
            comment_author: item.user.name,
            comment_content: item.comment,
          })),
        },
      })
    } catch (error) {
      console.error(error)
      return reply.status(500).send({
        message: JSON.stringify(error),
      })
    }
  })
}

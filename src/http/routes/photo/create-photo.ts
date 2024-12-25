import '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

import { FastifyInstance } from 'fastify'
import { auth } from '../middlewares/auth'
import { uploadToCloudinary } from '@/utils/upload-to-cloudinary'
import { z } from 'zod'

const schema = z.object({
  idade: z.string({ message: 'Selecione uma idade' }),
  img: z.string({ message: 'Seleciona uma imagem' }),
  nome: z.string({ message: 'Digite um nome' }),
  peso: z.string({ message: 'Digite um peso' }),
})

export function CreatePhoto(app: FastifyInstance) {
  app.register(auth).post('/photo', async (req, reply) => {
    const userId = await req.getCurrentUserId()
    try {
      const { idade, img, nome, peso } = schema.parse(req.body)
      const imageUrl = await uploadToCloudinary(img)
      const data = await prisma.photo.create({
        data: {
          idade: Number(idade),
          nome,
          peso: Number(peso),
          acessos: 0,
          imagem: imageUrl,
          userId: String(userId),
        },
      })
      console.log({ data })
      return reply.send({ success: true, data })
    } catch (error) {
      console.error(error)
      return reply.status(500).send({
        error: 'Erro ao processar o formulário',
        message: JSON.stringify(error),
      })
    }
  })
}

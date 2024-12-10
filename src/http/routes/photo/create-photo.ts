import '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

import { FastifyInstance } from 'fastify'
import { auth } from '../middlewares/auth'
import { extractParts } from '@/utils/extract-multpart'
import { uploadToCloudinary } from '@/utils/upload-to-cloudinary'

export function CreatePhoto(app: FastifyInstance) {
  app.register(auth).post('/photo', async (req, reply) => {
    const userId = await req.getCurrentUserId()
    try {
      const parts = req.parts()
      const { idade, img, nome, peso } = await extractParts(parts)
      const imageUrl = await uploadToCloudinary(img)
      console.log({ idade, imageUrl, nome, peso })
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
      console.log('Base de dados', data)
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

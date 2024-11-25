import { FastifyInstance } from 'fastify'

export function CreatePhoto(app: FastifyInstance) {
  app.post('/photo', async (req, reply) => {
    try {
      // const parts = req.parts()
      const img = await req.file()
      console.log('sssss', img)

      // const formdata: Record<string, any> = {}
      // for await (const part of parts) {
      //   if (part.file) {
      //     // Manipulação de arquivos
      //     const chunks: Buffer[] = []
      //     for await (const chunk of part.file) {
      //       chunks.push(chunk)
      //     }
      //     formdata[part.fieldname] = Buffer.concat(chunks)
      //   } else {
      //     // Manipulação de campos regulares
      //     formdata[part.fieldname] = part.value
      //   }
      // }

      // console.log(formdata)
      return reply.send({ success: true, data: {} })
    } catch (error) {
      console.error(error)
      return reply.status(500).send({ error: 'Erro ao processar o formulário' })
    }
  })
}

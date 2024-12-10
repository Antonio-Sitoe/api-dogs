import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { decrypt } from '@/lib/token'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const session = request.headers.authorization
          ?.replace('Bearer', '')
          .trim()
        const userId = await decrypt(session)
        return userId.sub
      } catch {
        throw new UnauthorizedError('Invalid token')
        return ''
      }
    }
  })
})

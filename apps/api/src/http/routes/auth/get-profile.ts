import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        tags: ['auth'],
        summary: 'Get authenticated user profile',
        security: [{ apiKey: [] }],
        response: {
          200: z.object({
            user: z.object({
              id: z.string().uuid(),
              name: z.string().nullable(),
              email: z.string(),
              avatarUrl: z.string().url().nullable(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sub } = await request.jwtVerify<{ sub: string }>()

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
        where: {
          id: sub,
        },
      })

      if (!user) {
        throw new Error('User not found')
      }

      return reply.send({ user })
    },
  )
}
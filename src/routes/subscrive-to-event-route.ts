import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { subscribeToEvent } from '../functions/subscribe-to-event'

export const subscribeToEventRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/subscriptions',
    {
      schema: {
        summary: 'Subscribes someone to the event',
        tags: ['subscription'],
        operationId: 'subscribeToEvent',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          referrer: z.string().nullish(),
        }),
        response: {
          201: z.object({
            subscriberId: z.string(),
          }),
          400: z.object({
            error: z.string(),
            message: z.string(),
          }),
          500: z.object({
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { name, email, referrer } = request.body

        // Simulate possible error for demonstration
        if (!name || !email) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'Name and email are required',
          })
        }

        const { subscriberId } = await subscribeToEvent({
          name,
          email,
          referrerId: referrer,
        })

        return reply.status(201).send({ subscriberId })
      } catch (error) {
        console.error('Error subscribing to event:', error)
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred while subscribing to the event',
        })
      }
    }
  )
}

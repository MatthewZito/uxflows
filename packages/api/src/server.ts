/* eslint-disable @typescript-eslint/require-await */
import 'module-alias/register'
import './dotenv'

import { createServer } from 'http'

import { ERROR_MESSAGES } from '@uxc/common/node'
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  AuthenticationError,
} from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import { app } from '@/app'
import { corsOptions, sessionMiddleware } from '@/middleware'
import { schema } from '@/schema'
import {
  apolloErrorHandler as formatError,
  expressErrorHandler,
  NotFoundError,
} from '@/services/error'
import { logger } from '@/services/logger'

import type { JWT, JWTPayload } from '@uxc/common/node'
import type { Request, Response } from 'express'

declare module 'express-session' {
  export interface SessionData {
    accessToken: JWT
    refreshToken: JWT
    meta?: JWTPayload
  }
}

// we keep this here so we can extract and test
export async function initializeServer() {
  const httpServer = createServer(app)

  const server = new ApolloServer({
    formatError,

    context: ({ req }) => ({ req }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              logger.info('subscription server closing...')
              subscriptionServer.close()
            },
          }
        },
      },
      ApolloServerPluginLandingPageLocalDefault({
        footer: true,
      }),
    ],
    schema,
  })

  await server.start()
  server.applyMiddleware({
    app,
    cors: corsOptions,
  })

  const subscriptionServer = new SubscriptionServer(
    {
      execute,
      schema,
      subscribe,

      async onConnect(
        _: Record<string, unknown>,
        socket: { upgradeReq: Request },
      ) {
        const { id } = await new Promise<JWTPayload>(resolve => {
          sessionMiddleware(socket.upgradeReq, _ as unknown as Response, () => {
            if (socket.upgradeReq.session.meta) {
              resolve(socket.upgradeReq.session.meta)
            }
          })
        })

        if (!id) {
          throw new AuthenticationError(ERROR_MESSAGES.E_AUTHORIZATION_REQUIRED)
        }

        return { id }
      },
    },
    {
      path: `/${process.env.VITE_API_SUBSCRIPTIONS_PATH}`,
      server: httpServer,
    },
  )

  app
    .all('*', () => {
      throw new NotFoundError()
    })
    .use(expressErrorHandler)

  return {
    httpServer,
    server,
  }
}

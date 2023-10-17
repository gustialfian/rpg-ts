import fastify from 'fastify'
import bcryptPlugin from './bcrypt'
import configPlugin from './config'
import dbPlugin from './db'
import itemsRoute from './items'
import jwtPlugin from './jwt'
import swaggerPlugin from './swagger'
import usersRoute from './users'
import authRoute from './auth'

export async function build(opts: any) {
  const app = fastify(opts)

  // shared plugin
  app.register(configPlugin)
  app.register(dbPlugin)
  app.register(swaggerPlugin)
  app.register(bcryptPlugin)
  app.register(jwtPlugin)

  // routes plugin
  app.register(authRoute, { prefix: 'auth' })
  app.register(async (authApp) => {
    authApp.addHook('onRequest', authApp.jwtGuard)

    authApp.register(usersRoute, { prefix: 'users' })
    authApp.register(itemsRoute, { prefix: 'items' })
  })

  return app
}

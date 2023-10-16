import fastify from 'fastify'
import config from './config'
import db from './db'
import swagger from './swagger'
import itemRoute from './items'

export async function build(opts: any) {
  const app = fastify(opts)

  app.register(config)
  app.register(db)
  app.register(swagger)

  app.register(itemRoute, { prefix: 'items' })

  return app
}

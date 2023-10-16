import fastifyEnv from '@fastify/env'
import { FastifyPluginAsyncTypebox, Static, Type } from '@fastify/type-provider-typebox'
import fp from 'fastify-plugin'


const schema = Type.Object({
    PORT: Type.String({ default: 3000 }),
    HOST: Type.String({ default: '127.0.0.1' }),
    DB_CON: Type.String({ default: 'postgres://sandbox:sandbox@127.0.0.1:5432/rpg' }),
})

const config: FastifyPluginAsyncTypebox = async (app) => {
    app.log.info('register config')

    await app.register(fastifyEnv, {
        dotenv: true,
        schema: schema
    })
}

declare module 'fastify' {
    interface FastifyInstance {
        config: Static<typeof schema>
    }
}

export default fp(config, { name: 'config' })
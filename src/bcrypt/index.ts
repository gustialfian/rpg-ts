import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import bcrypt from 'bcrypt'
import fp from 'fastify-plugin'


const bcryptPlugin: FastifyPluginAsyncTypebox = async (app) => {
    app.log.info('register bcrypt')

    const salt = 10

    const hash = (plain: string) => bcrypt.hash(plain, salt)

    const compare = (claim1: string, claim2: string) => bcrypt.compare(claim1, claim2)

  app.decorate('bcrypt', {
      hash,
      compare
    })

}

declare module 'fastify' {
    interface FastifyInstance {
        bcrypt: {
            hash: (plain: string) => Promise<string>,
            compare: (claim1: string, claim2: string) => Promise<boolean>,
        }
    }
}

export default fp(bcryptPlugin, { name: 'config' })
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";


const jwtPlugin: FastifyPluginAsyncTypebox = async (app) => {
    app.log.info('register jwtPlugin')

    app.register(fastifyJwt, {
        secret: app.config.JWT_SECRET,
    })


    const jwtGuard = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            await req.jwtVerify()
        } catch (err) {
            reply.code(401).send('not authenticate')
        }
    }

    app.decorate('jwtGuard', jwtGuard)
}

declare module 'fastify' {
    interface FastifyInstance {
        jwtGuard: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
    }
}

export default fp(jwtPlugin, { name: 'jwt' })
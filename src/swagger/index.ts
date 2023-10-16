import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"
import fp from "fastify-plugin";
import swaggerPlugin from '@fastify/swagger'
import swaggerUiPlugin from '@fastify/swagger-ui'
import { version } from '../../package.json'


const swagger: FastifyPluginAsyncTypebox = async (app) => {
    app.log.info('register swagger')

    app.register(swaggerPlugin, {swagger: {
        info: {
            title: 'RPG TS',
            version: version,
        }
    }})
    app.register(swaggerUiPlugin, { routePrefix: '/docs' })
}

export default fp(swagger, { name: 'swagger' })
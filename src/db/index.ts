import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import fp from 'fastify-plugin'
import {Pool} from 'pg'

const db: FastifyPluginAsyncTypebox = async (app) => {
    app.log.info('register db')
    app.log.info(app.config)

    const pool = new Pool({
        connectionString: app.config.DB_CON,
    });
    const db = drizzle(pool);
    await db.execute(sql`select now()`)
    app.decorate('db', db)
    app.addHook('onClose', async () => {
        app.log.info('close db')
        await pool.end()
    })
}



declare module 'fastify' {
    interface FastifyInstance {
        db: ReturnType<typeof drizzle> 
    }
}

export default fp(db, { name: 'db' })
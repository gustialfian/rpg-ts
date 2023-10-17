import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox"
import { insertUserSchema, selectUserSchema, users } from "./schema"
import { eq } from "drizzle-orm"

const usersRoute: FastifyPluginAsyncTypebox = async (app) => {
    app.log.info('register usersRoute')

    const { db, bcrypt } = app

    app.post(
        '/create',
        {
            schema: {
                tags: ['users'],
                body: insertUserSchema,
                response: {
                    200: selectUserSchema,
                }
            }
        },
        async (request) => {
            const data = request.body
            data.password = await bcrypt.hash(data.password)

            const rows = await db.insert(users)
                .values(data)
                .returning()

            return rows[0]
        }
    )

    app.get(
        '/all',
        {
            schema: {
                tags: ['users'],
                response: {
                    200: Type.Array(selectUserSchema),
                }
            }
        },
        async (request) => {
            const data = await db.select().from(users)

            return data
        }
    )

    app.get(
        '/by',
        {
            schema: {
                tags: ['users'],
                querystring: Type.Object({
                    id: Type.Number(),
                }),
                response: {
                    200: selectUserSchema,
                }
            }
        },
        async (req) => {
            const data = await db.select()
                .from(users)
                .where(eq(users.id, req.query.id))

            return data[0]
        }
    )

    app.put(
        '/update',
        {
            schema: {
                tags: ['users'],
                body: selectUserSchema,
                response: {
                    200: selectUserSchema,
                }
            }
        },
        async (req) => {
            const { id, ...data } = req.body
            data.password = await bcrypt.hash(data.password)

            const rows = await db.update(users)
                .set(data)
                .where(eq(users.id, id))
                .returning()

            return rows[0]
        }
    )

    app.delete(
        '/delete',
        {
            schema: {
                tags: ['users'],
                querystring: Type.Object({
                    id: Type.Number(),
                }),
                response: {
                    200: selectUserSchema,
                }
            }
        },
        async (req) => {
            const rows = await db.delete(users)
                .where(eq(users.id, req.query.id))
                .returning()

            return rows[0]
        }
    )
}

export default usersRoute
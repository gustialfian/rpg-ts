import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { NewItems, items } from "./schema";
import { eq } from "drizzle-orm";


const itemsRoute: FastifyPluginAsyncTypebox = async (app) => {
    app.log.info('register itemsRoute')

    const { db } = app

    const ItemPayload = Type.Object({
        id: Type.Optional(Type.Number()),
        name: Type.String(),
        attributes: Type.Optional(Type.Any()),
    })

    app.post(
        '/create',
        {
            schema: {
                tags: ['items'],
                body: ItemPayload,
                response: {
                    200: ItemPayload
                }
            }
        },
        async (request) => {
            const data: NewItems = request.body

            const newData = await db.insert(items)
                .values({
                    name: data.name,
                    attributes: data.attributes,
                })
                .returning()

            return newData[0]
        }
    )

    app.get(
        '/all',
        {
            schema: {
                tags: ['items'],
                response: {
                    200: Type.Array(ItemPayload)
                }
            }
        },
        async () => {
            const data = await db.select().from(items)
            return data
        }
    )

    app.get(
        '/by',
        {
            schema: {
                tags: ['items'],
                querystring: Type.Object({
                    id: Type.Number(),
                }),
                response: {
                    200: Type.Array(ItemPayload)
                }
            }
        },
        async (req) => {
            const {id} = req.query
            const data = await db.select().from(items).where(eq(items.id, id))
            return data
        }
    )

    app.put(
        '/update',
        {
            schema: {
                tags: ['items'],
                body: Type.Object({
                    id: Type.Number(),
                    name: Type.String(),
                    attributes: Type.Optional(Type.Any()),
                }),
                response: {
                    200: ItemPayload
                }
            }
        },
        async (request) => {
            const data = request.body

            const newData = await db.update(items)
                .set({
                    name: data.name,
                    attributes: data.attributes,
                })
                .where(eq(items.id, data.id))
                .returning()

            return newData[0]
        }
    )

    app.delete(
        '/delete',
        {
            schema: {
                tags: ['items'],
                querystring: Type.Object({
                    id: Type.Number(),
                }),
                response: {
                    200: ItemPayload
                }
            }
        },
        async (request) => {
            const { id } = request.query

            const newData = await db.delete(items)
                .where(eq(items.id, id))
                .returning()

            return newData[0]
        }
    )

}

export default itemsRoute
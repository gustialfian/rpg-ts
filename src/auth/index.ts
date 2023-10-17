import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox"
import { eq } from "drizzle-orm"
import { users } from "./schema"

const usersRoute: FastifyPluginAsyncTypebox = async (app) => {
    app.log.info('register usersRoute')

    const { db, bcrypt, jwt, jwtGuard } = app

    app.post(
        '/sign-in',
        {
            schema: {
                tags: ['auth'],
                body: Type.Object({
                    username: Type.String(),
                    password: Type.String(),
                }),
                response: {
                    200: Type.Object({
                        jwt: Type.String(),
                    }),
                    401: Type.Object({
                        msg: Type.String(),
                    }),
                }
            }
        },
        async (req, reply) => {

            const rows = await db
                .select({
                    password: users.password
                })
                .from(users)
                .where(eq(users.username, req.body.username))

            const isOk = await bcrypt.compare(req.body.password, rows[0].password)
            if (!isOk) {
                reply.code(401).send({
                    msg: 'wrong credential'
                })
                return 
            }

            const jwtStr = jwt.sign({ username: req.body.username })

            return {
                jwt: jwtStr
            }
        }
    )

    app.get(
        '/protect',
        {
            onRequest: [jwtGuard],
            schema: {
                tags: ['auth'],
                response: {
                    200: Type.String(),
                    401: Type.String(),
                }
            }
        },
        async () => {
            return 'ok'
        }
    )
}

export default usersRoute
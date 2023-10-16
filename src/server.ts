import closeWithGrace from "close-with-grace";
import { build } from "./app";


async function start() {
    const opts = {
        logger: {
            level: 'info',
            transport: {
                target: 'pino-pretty',
            }
        }
    }

    const app = await build(opts)

    await app.listen({
        port: 3000,
        host: '127.0.0.1'
    })

    closeWithGrace(async ({ err }) => {
        if (err) {
            app.log.error({ err }, 'server closing due to error')
        }
        app.log.info('shutting down gracefully')
        await app.close()
    })
}

start()
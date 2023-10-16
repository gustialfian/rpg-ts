import type { Config } from "drizzle-kit";

export default {
    schema: "./src/**/schema.ts",
    out: "./migrations",
    driver: 'pg',
    dbCredentials: {
      connectionString: 'postgres://sandbox:sandbox@127.0.0.1:5432/rpg',
    }
} satisfies Config;

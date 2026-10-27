import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

let dbInstance: any;
let poolInstance: Pool | undefined;

if (databaseUrl) {
  try {
    poolInstance =
      globalForDb.__arenaNextJsPostgresqlPool ??
      new Pool({
        connectionString: databaseUrl,
      });

    if (process.env.NODE_ENV !== "production") {
      globalForDb.__arenaNextJsPostgresqlPool = poolInstance;
    }

    dbInstance = drizzle(poolInstance);
  } catch (err) {
    console.warn("[AI Studio] Database connection initialization failed, using fallback mock", err);
  }
}

if (!dbInstance) {
  console.warn("[AI Studio] DATABASE_URL not set — using in-memory mock");
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  };

  const createChainable = (): any => {
    const chain: any = () => chain;
    return new Proxy(chain, {
      get: (_target, prop) => {
        if (prop === "then") {
          return (resolve: any) => resolve([]);
        }
        if (prop === "catch") {
          return () => Promise.resolve([]);
        }
        return createChainable();
      },
      apply: () => createChainable(),
    });
  };

  dbInstance = new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === "query") return new Proxy({}, { get: () => noOp });
        if (prop === "execute") return async () => ({ rows: [] });
        return createChainable();
      },
    }
  );
}

export const pool = poolInstance ?? ({} as Pool);
export const db = dbInstance;

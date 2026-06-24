import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const databaseConfigured = Boolean(process.env.DATABASE_URL);
export const databaseEnabled = databaseConfigured && process.env.RESI_USE_DATABASE === "true";

function createPrismaClient() {
  const client = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

let prismaClient: PrismaClient | undefined;

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    prismaClient ??= createPrismaClient();
    return Reflect.get(prismaClient, prop, receiver);
  }
});

export const hasDatabaseUrl = databaseEnabled;

export async function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for Mode B hosted Postgres deployment.");
  }
}

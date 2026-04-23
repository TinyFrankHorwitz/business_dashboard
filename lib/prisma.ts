import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../node_modules/.prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!global.prisma) {
    const adapter = new PrismaPg(process.env.DATABASE_URL);

    global.prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
    });
  }

  return global.prisma;
}

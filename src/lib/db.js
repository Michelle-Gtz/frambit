// import { PrismaClient } from "@prisma/client";

// export const db =
//   globalThis.prisma ||
//   new PrismaClient({
//     log: ["query", "info", "warn", "error"],
//   });

// if (process.env.NODE_ENV === "development") globalThis.prisma = db;

// export default db;

import { PrismaClient } from "../../generated/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// 1. Create the Pool and Adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Singleton Function
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

// 3. Global Object Handling (prevents hot-reload crashes)
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || prismaClientSingleton();
export default prisma;
if (process.env.NODE_ENV !== "development") globalForPrisma.prisma = prisma;

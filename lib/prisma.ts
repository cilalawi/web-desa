import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// ponytail: force verify-full to silence pg SSL warning; upgrade to pg v9 drops this
const dbUrl = process.env.DATABASE_URL ?? ''
const url = dbUrl && !dbUrl.includes('sslmode=verify-full')
  ? dbUrl.replace(/sslmode=require/, 'sslmode=verify-full')
  : dbUrl
const adapter = new PrismaPg({ connectionString: url })

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

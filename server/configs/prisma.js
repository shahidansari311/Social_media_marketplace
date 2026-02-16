import 'dotenv/config'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'; 
// import { prisma } from './db'

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
    // const users = await prisma.user.findMany()
})

export const prisma = new PrismaClient({ adapter })
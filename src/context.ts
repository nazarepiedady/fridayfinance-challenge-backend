import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient()

export interface Context {
  prisma: PrismaClient
}

export const context: Context = {
  prisma
}
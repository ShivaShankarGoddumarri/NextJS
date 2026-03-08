import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: process.env.DATABASE_URL!,
})

const adapter = new PrismaLibSQL(libsql)
const prisma = new PrismaClient({ adapter })

export async function GET() {
  try {
    // Test database connection and create a test user
    await prisma.$connect()

    const user = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        name: 'Test User',
      },
    })

    return NextResponse.json({ message: 'Database connected successfully', user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Database operation failed' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
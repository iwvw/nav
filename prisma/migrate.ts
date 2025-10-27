import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: any, res: any) {
  try {
    // 检查数据库连接
    await prisma.$connect()
    
    // 运行数据库迁移
    const result = await prisma.$executeRaw`SELECT 1`
    
    res.status(200).json({ 
      status: 'success', 
      message: 'Database connected successfully',
      result 
    })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  } finally {
    await prisma.$disconnect()
  }
}
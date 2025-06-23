import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client' // ✅ Importa o enum QueryMode corretamente
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const name = searchParams.get('name') || ''
  const minDate = searchParams.get('minDate')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '6')
  const skip = (page - 1) * limit

  try {
    const where = {
      name: {
        contains: name,
        mode: Prisma.QueryMode.insensitive, // ✅ Aqui está a correção
      },
      ...(minDate && {
        expiresAt: {
          gte: new Date(minDate),
        },
      }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { expiresAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({ data: products, total, page, limit })
  } catch (error) {
    console.error('Erro na API:', error) // 👈 agora ela está sendo usada
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 },
    )
  }
}

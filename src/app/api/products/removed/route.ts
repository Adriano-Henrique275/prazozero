import { adaptDateOutput } from '@/lib/date/adapters'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 🗑️ Rota: /api/products/removed
export async function GET() {
  try {
    const removidos = await prisma.product.findMany({
      where: { status: 'REMOVIDO' },
      orderBy: { removedAt: 'desc' },
      select: {
        id: true,
        name: true,
        category: true,
        quantity: true,
        expiresAt: true,
        removedAt: true,
        removalReason: true,
        createdAt: true,
      },
    })

    const data = removidos.map((produto) => ({
      ...produto,
      expiresAt: adaptDateOutput(produto.expiresAt),
      removedAt: produto.removedAt ? adaptDateOutput(produto.removedAt) : null,
      createdAt: adaptDateOutput(produto.createdAt),
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Erro ao buscar produtos removidos:', error)
    return NextResponse.json(
      { error: 'Erro interno ao buscar produtos removidos.' },
      { status: 500 },
    )
  }
}

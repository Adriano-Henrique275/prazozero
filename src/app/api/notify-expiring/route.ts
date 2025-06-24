import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  try {
    const vencendoHoje = await prisma.product.findMany({
      where: {
        expiresAt: {
          gte: start,
          lte: end,
        },
      },
    })

    if (vencendoHoje.length === 0) {
      return NextResponse.json({ message: 'Nada vencendo hoje.' })
    }

    return NextResponse.json({
      message: `✔️ ${vencendoHoje.length} produto(s) vencendo hoje.`,
      produtos: vencendoHoje,
    })
  } catch (erro) {
    console.error('Erro interno:', erro)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos vencendo hoje.' },
      { status: 500 },
    )
  }
}

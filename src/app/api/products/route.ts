import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validators/product'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = productSchema.parse(body)

    const product = await prisma.product.create({ data: parsed })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 400 },
    )
  }
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { expiresAt: 'asc' },
  })

  return NextResponse.json(products)
}

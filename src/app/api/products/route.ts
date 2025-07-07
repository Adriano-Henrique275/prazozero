import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validators/product'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { expiresAt: 'asc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = productSchema.parse(body)

    const product = await prisma.product.create({ data: parsed }) // `expiresAt` já transformado no schema

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 400 },
    )
  }
}

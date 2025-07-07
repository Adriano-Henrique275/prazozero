import { adaptDateOutput } from '@/lib/date/adapters'
import { prisma } from '@/lib/prisma'
import { productUpdateSchema } from '@/lib/validators/productUpdate'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// 🧾 GET /api/products/[id]
export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
  }

  try {
    const produto = await prisma.product.findUnique({
      where: { id },
    })

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado.' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      ...produto,
      expiresAt: adaptDateOutput(produto.expiresAt),
    })
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno ao buscar produto.' },
      { status: 500 },
    )
  }
}

// ✏️ PUT /api/products/[id]
export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const data = productUpdateSchema.parse(body)

    const updated = await prisma.product.update({
      where: { id },
      data,
    })

    return NextResponse.json({
      ...updated,
      expiresAt: adaptDateOutput(updated.expiresAt),
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Produto não encontrado para atualização.' },
        { status: 404 },
      )
    }

    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno ao atualizar produto.' },
      { status: 500 },
    )
  }
}

// 🗑️ DELETE /api/products/[id]
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
  }

  try {
    const removed = await prisma.product.update({
      where: { id },
      data: {
        status: 'REMOVIDO',
        removedAt: new Date(),
        removalReason: 'Removido manualmente pela API',
      },
    })

    return NextResponse.json({
      message: 'Produto marcado como REMOVIDO com sucesso.',
      produto: {
        ...removed,
        expiresAt: adaptDateOutput(removed.expiresAt),
      },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Produto não encontrado.' },
        { status: 404 },
      )
    }

    console.error('Erro ao remover produto:', error)
    return NextResponse.json(
      { error: 'Erro interno ao remover produto.' },
      { status: 500 },
    )
  }
}

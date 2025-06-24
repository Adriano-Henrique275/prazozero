import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validators/product'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// 🔄 Atualizar produto por ID
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params

  if (!id) {
    return NextResponse.json(
      { error: 'ID do produto não fornecido.' },
      { status: 400 },
    )
  }

  try {
    const body = await request.json()
    const data = productSchema.partial().parse(body)

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    })

    return NextResponse.json(updatedProduct)
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Produto não encontrado para atualização.' },
        { status: 404 },
      )
    }

    console.error('Erro ao atualizar produto:', err)
    return NextResponse.json(
      { error: 'Erro interno ao atualizar produto.' },
      { status: 500 },
    )
  }
}

// ❌ Deletar produto por ID
export async function DELETE(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params

  if (!id) {
    return NextResponse.json(
      { error: 'ID do produto não fornecido.' },
      { status: 400 },
    )
  }

  try {
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Produto removido com sucesso!' },
      { status: 200 },
    )
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Produto não encontrado.' },
        { status: 404 },
      )
    }

    console.error('Erro ao deletar produto:', err)
    return NextResponse.json(
      { error: 'Erro interno ao deletar produto.' },
      { status: 500 },
    )
  }
}

// 📦 Buscar produto por ID
export async function GET(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params

  if (!id) {
    return NextResponse.json({ error: 'ID não fornecido.' }, { status: 400 })
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

    return NextResponse.json(produto)
  } catch (err) {
    console.error('Erro ao buscar produto:', err)
    return NextResponse.json(
      { error: 'Erro interno ao buscar produto.' },
      { status: 500 },
    )
  }
}

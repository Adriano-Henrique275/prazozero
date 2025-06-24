import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validators/product'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

type Context = {
  params: {
    id: string
  }
}

// 📦 Buscar produto por ID
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, context: any) {
  const id = context?.params?.id

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
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno ao buscar produto.' },
      { status: 500 },
    )
  }
}

// 🔄 Atualizar produto por ID
export async function PUT(request: NextRequest, context: Context) {
  const { id } = context.params

  try {
    const body = await request.json()
    const data = productSchema.partial().parse(body)

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    })

    return NextResponse.json(updatedProduct)
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

// ❌ Deletar produto por ID
export async function DELETE(_request: NextRequest, context: Context) {
  const { id } = context.params

  try {
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Produto removido com sucesso!' },
      { status: 200 },
    )
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

    console.error('Erro ao deletar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno ao deletar produto.' },
      { status: 500 },
    )
  }
}

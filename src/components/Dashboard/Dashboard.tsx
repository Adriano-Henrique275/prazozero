'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  FiAlertCircle,
  FiBox,
  FiCheckCircle,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi'

import { adaptDateOutput } from '@/lib/date/adapters'
import { Product } from '@prisma/client'

export const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error()
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
      }
    }

    fetchProducts()
  }, [])

  const today = new Date()

  const expiringSoon = products.filter((product) => {
    if (!product.expiresAt || product.status !== 'ATIVO') return false
    const expiration = new Date(product.expiresAt)
    const diffDays =
      (expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  })

  const getStatusStyle = (status: Product['status']) => {
    const base =
      'border rounded-lg p-4 bg-zinc-900 hover:scale-[1.01] transition-transform duration-300'
    const variants: Record<Product['status'], string> = {
      ATIVO: 'bg-green-600/10 text-green-400 border-green-600/40',
      VENCIDO: 'bg-yellow-600/10 text-yellow-400 border-yellow-600/40',
      REMOVIDO: 'bg-zinc-600/10 text-zinc-400 border-zinc-600/40',
    }

    return `${base} ${
      variants[status] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'
    }`
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 px-4 py-10">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-zinc-100">PrazoZero 🚀</h1>
        <p className="text-sm text-zinc-400">
          Acompanhe seus produtos antes que expirem.
        </p>
      </header>

      {/* Alert */}
      <div>
        {expiringSoon.length > 0 ? (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-sm font-medium">
            <FiAlertCircle className="w-4 h-4" />
            {expiringSoon.length} produto{expiringSoon.length > 1 && 's'}{' '}
            vencendo em breve
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-600/10 text-green-500 text-sm font-medium">
            <FiCheckCircle className="w-4 h-4" />
            Tudo em dia! Nenhum vencimento próximo
          </span>
        )}
      </div>

      {/* Lista de produtos */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-200">
          Todos os Produtos
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <li key={product.id} className={getStatusStyle(product.status)}>
              <div className="flex justify-between items-start">
                <div className="text-lg font-medium text-zinc-100">
                  {product.name}
                </div>
                <span className="text-xs font-medium uppercase px-2 py-0.5 rounded-full border">
                  {product.status}
                </span>
              </div>

              {product.expiresAt && (
                <div className="text-sm text-zinc-400">
                  Vence em: {adaptDateOutput(product.expiresAt)}
                </div>
              )}

              {product.category && (
                <span className="text-xs text-zinc-500">
                  Categoria: {product.category}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <Link href="/produtos" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-4 py-2 rounded-md bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2">
            <FiBox className="w-4 h-4" />
            Ver todos os produtos
          </button>
        </Link>

        <Link href="/cadastrar" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-500 border border-green-700 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2">
            <FiPlus className="w-4 h-4" />
            Cadastrar novo
          </button>
        </Link>

        <Link href="/produtos/removidos" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-4 py-2 rounded-md bg-zinc-700 text-zinc-100 hover:bg-zinc-600 border border-zinc-600 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2">
            <FiTrash2 className="w-4 h-4" />
            Ver produtos removidos
          </button>
        </Link>
      </div>
    </div>
  )
}

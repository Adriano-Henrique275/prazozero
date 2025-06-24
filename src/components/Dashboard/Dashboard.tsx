'use client'

import { Product } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiAlertCircle, FiBox, FiCheckCircle, FiPlus } from 'react-icons/fi'

export const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    }

    fetchProducts()
  }, [])

  const expiringSoon = products.filter((product) => {
    const today = Date.now()
    const expiration = new Date(product.expiresAt).getTime()
    const daysUntilExpire = Math.ceil(
      (expiration - today) / (1000 * 60 * 60 * 24),
    )
    return daysUntilExpire <= 7
  })

  const getCardClasses = (expiresAt: string | Date) => {
    const expiration =
      typeof expiresAt === 'string'
        ? new Date(expiresAt).getTime()
        : expiresAt.getTime()

    const today = Date.now()
    const diffInDays = Math.ceil((expiration - today) / (1000 * 60 * 60 * 24))

    if (expiration < today) {
      return 'border-red-600/40 hover:bg-red-800/10'
    } else if (diffInDays <= 1) {
      return 'border-yellow-600/40 hover:bg-yellow-800/10'
    } else {
      return 'border-zinc-800 hover:bg-zinc-800/30'
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 px-4 py-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-zinc-100">PrazoZero 🚀</h1>
        <p className="text-sm text-zinc-400">
          Acompanhe seus produtos antes que expirem.
        </p>
      </header>

      <div>
        {expiringSoon.length > 0 ? (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-sm font-medium">
            <FiAlertCircle className="w-4 h-4" />
            {expiringSoon.length} produto
            {expiringSoon.length > 1 && 's'} vencendo em breve
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-600/10 text-green-500 text-sm font-medium">
            <FiCheckCircle className="w-4 h-4" />
            Tudo em dia! Nenhum vencimento próximo
          </span>
        )}
      </div>

      {expiringSoon.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-200">
            Vencendo nos próximos dias
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expiringSoon.slice(0, 3).map((product) => (
              <li
                key={product.id}
                className={`border rounded-lg p-4 bg-zinc-900 transition-transform duration-300 ease-in-out hover:scale-[1.01] ${getCardClasses(
                  product.expiresAt,
                )}`}
              >
                <div className="text-lg font-medium text-zinc-100">
                  {product.name}
                </div>
                <div className="text-sm text-zinc-400">
                  Vence em:{' '}
                  {new Date(product.expiresAt).toLocaleDateString('pt-BR')}
                </div>
                {product.category && (
                  <span className="text-xs text-zinc-500">
                    Categoria: {product.category}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

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
      </div>
    </div>
  )
}

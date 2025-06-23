'use client'

import { Product } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ProductCard } from '../Product/ProductCard'
import { Button } from '../ui/Button'

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

  const expiringSoon = products.filter((p) => {
    const days = Math.ceil(
      (new Date(p.expiresAt).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    )
    return days <= 7
  })

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6 px-4 py-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">PrazoZero 🚀</h1>
        <p className="text-sm text-gray-600">
          Acompanhe seus produtos antes que expirem!
        </p>
      </header>

      {expiringSoon.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            ⚠️ Vencendo em breve
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expiringSoon.slice(0, 3).map((prod) => (
              <ProductCard
                key={prod.id}
                name={prod.name}
                expiresAt={prod.expiresAt.toString()}
              />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-green-600 font-medium">
          ✅ Nenhum produto perto do vencimento
        </p>
      )}

      <div className="flex justify-center mt-6">
        <Link href="/cadastrar">
          <Button>Cadastrar novo produto</Button>
        </Link>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi'

import { ProductCard } from '@/components/Product/ProductCard'
import { Button } from '@/components/ui/Button'

type ProdutoRemovido = {
  id: string
  name: string
  expiresAt: string
  category?: string | null
  removalReason?: string | null
  status?: 'REMOVIDO'
  removedAt?: string | null
}

export default function ProdutosRemovidosPage() {
  const [products, setProducts] = useState<ProdutoRemovido[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRemovidos = async () => {
      try {
        const res = await fetch('/api/products/removed')
        if (!res.ok) throw new Error('Falha ao buscar produtos removidos')
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error(error)
        toast.error('Erro ao carregar produtos removidos 😢')
      } finally {
        setLoading(false)
      }
    }

    fetchRemovidos()
  }, [])

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <FiTrash2 className="w-5 h-5" />
          Produtos Removidos
        </h1>

        <div className="flex gap-2">
          <Link href="/">
            <Button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 flex items-center gap-2 px-4 py-2 rounded">
              <FiArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/cadastrar">
            <Button className="bg-green-600 hover:bg-green-500 text-white flex items-center gap-2 px-4 py-2 rounded">
              <FiPlus className="w-4 h-4" />
              Novo Produto
            </Button>
          </Link>
        </div>
      </header>

      {/* Info */}
      {products.length > 0 && (
        <div className="text-sm text-zinc-400">
          {products.length} produto{products.length > 1 && 's'} removido
          {products.length > 1 && 's'} no histórico
        </div>
      )}

      {/* Grid de cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-zinc-400">Carregando produtos removidos...</p>
        ) : products.length > 0 ? (
          products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              expiresAt={p.expiresAt}
              category={p.category ?? undefined}
              status={p.status}
              removalReason={p.removalReason}
              disabled
            />
          ))
        ) : (
          <p className="text-zinc-500">
            Nenhum produto foi removido até o momento.
          </p>
        )}
      </section>
    </main>
  )
}

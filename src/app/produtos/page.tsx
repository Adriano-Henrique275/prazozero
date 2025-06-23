'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { ProductCard } from '@/components/Product/ProductCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Product = {
  id: string
  name: string
  expiresAt: string
  category?: string
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [minDate, setMinDate] = useState('')
  const [page, setPage] = useState(1)
  const limit = 6

  const hojeISO = new Date().toISOString().split('T')[0]
  const vencemHoje = products.filter((p) => p.expiresAt.startsWith(hojeISO))
  const totalPages = Math.ceil(total / limit)

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        name: search,
        minDate,
        page: page.toString(),
        limit: limit.toString(),
      })

      const res = await fetch(`/api/products/search?${params}`)
      const { data, total } = await res.json()
      setProducts(data)
      setTotal(total)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      toast.error('Erro ao carregar produtos!')
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, minDate, page])

  useEffect(() => {
    if (products.length > 0 && vencemHoje.length > 0) {
      toast(
        `⏰ ${vencemHoje.length} produto${
          vencemHoje.length > 1 ? 's' : ''
        } vence hoje!`,
        {
          icon: '⚠️',
          style: {
            background: '#1f1f1f',
            color: '#facc15',
            border: '1px solid #eab308',
          },
        },
      )
    }
  }, [products])

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-zinc-100">
          📦 Produtos Cadastrados
        </h1>
        <Link href="/cadastrar">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            ➕ Novo Produto
          </Button>
        </Link>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-zinc-300 mb-1">
            🔍 Buscar por nome
          </label>
          <Input
            placeholder="Ex: Café, Leite..."
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-300 mb-1">
            📅 Validade a partir de
          </label>
          <Input
            type="date"
            value={minDate}
            onChange={(e) => {
              setPage(1)
              setMinDate(e.target.value)
            }}
          />
        </div>
      </section>

      {vencemHoje.length > 0 && (
        <div className="bg-yellow-400/10 border border-yellow-500 text-yellow-300 px-4 py-3 rounded text-sm font-medium">
          ⏰ {vencemHoje.length} produto{vencemHoje.length > 1 ? 's' : ''} vence
          hoje!
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.length > 0 ? (
          products.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              expiresAt={p.expiresAt}
              category={p.category}
            />
          ))
        ) : (
          <p className="text-zinc-500">
            Nenhum produto encontrado com esses filtros.
          </p>
        )}
      </section>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          >
            ← Anterior
          </Button>
          <span className="text-sm text-zinc-400">
            Página <strong>{page}</strong> de {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          >
            Próxima →
          </Button>
        </div>
      )}
    </main>
  )
}

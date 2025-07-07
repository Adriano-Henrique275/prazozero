'use client'

import { parse } from 'date-fns'
import Link from 'next/link'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { ProductCard } from '@/components/Product/ProductCard'
import { Button } from '@/components/ui/Button'
import { toastConfirm } from '@/lib/toastConfirm'
import { maskUtils } from '@/lib/utils/maskUtils'

import { FiBox, FiCalendar, FiClock, FiPlus, FiSearch } from 'react-icons/fi'

type Product = {
  id: string
  name: string
  expiresAt: string
  category?: string | null
  status?: 'ATIVO' | 'VENCIDO' | 'REMOVIDO'
  removalReason?: string | null
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [minDateInput, setMinDateInput] = useState('')
  const [page, setPage] = useState(1)
  const limit = 6

  const hojeISO = new Date().toISOString().split('T')[0]
  const vencemHoje = products.filter((p) => p.expiresAt.startsWith(hojeISO))
  const totalPages = Math.ceil(total / limit)

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('name', search)

      if (minDateInput) {
        const [d, m, y] = minDateInput.split('/')
        if (d && m && y) {
          const parsed = parse(`${y}-${m}-${d}`, 'yyyy-MM-dd', new Date())
          const iso = parsed.toISOString().split('T')[0]
          params.set('minDate', iso)
        }
      }

      params.set('page', page.toString())
      params.set('limit', limit.toString())

      const res = await fetch(`/api/products/search?${params}`)
      const { data, total } = await res.json()
      setProducts(data)
      setTotal(total)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      toast.error('Erro ao carregar produtos!')
    }
  }, [search, minDateInput, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (products.length && vencemHoje.length) {
      toast(
        `${vencemHoje.length} produto${
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

  const handleMinDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setMinDateInput(maskUtils.dateBR(e.target.value))
  }

  const handleDelete = async (id: string) => {
    toastConfirm({
      message: 'Deseja realmente deletar este produto?',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
          })
          if (!res.ok) throw new Error()
          toast.success('Produto removido com sucesso!')
          fetchProducts()
        } catch (erro) {
          toast.error('Erro ao deletar produto 😢')
          console.error(erro)
        }
      },
    })
  }

  const handleEdit = (id: string) => {
    window.location.href = `/editar/${id}`
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <FiBox className="w-5 h-5" />
          Produtos Cadastrados
        </h1>
        <Link href="/cadastrar">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded py-1 px-2 flex items-center gap-2 transition-colors hover:opacity-90 cursor-pointer">
            <FiPlus className="w-4 h-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
            <FiSearch className="w-4 h-4" />
            Buscar por nome
          </label>
          <input
            type="text"
            placeholder="Ex: Café, Leite..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
            <FiCalendar className="w-4 h-4" />
            Validade a partir de
          </label>
          <input
            type="text"
            placeholder="dd/mm/aaaa"
            value={minDateInput}
            onChange={handleMinDateChange}
            className="w-full appearance-none bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition cursor-text"
          />
        </div>
      </section>

      {vencemHoje.length > 0 && (
        <div className="bg-yellow-400/10 border border-yellow-500 text-yellow-300 px-4 py-3 rounded text-sm font-medium flex items-center gap-2">
          <FiClock className="w-4 h-4" />
          {vencemHoje.length} produto{vencemHoje.length > 1 ? 's' : ''} vence
          hoje!
        </div>
      )}

      {/* Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.length > 0 ? (
          products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              expiresAt={p.expiresAt}
              category={p.category ?? undefined}
              status={p.status}
              removalReason={p.removalReason}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <p className="text-zinc-500">
            Nenhum produto encontrado com esses filtros.
          </p>
        )}
      </section>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors hover:opacity-90 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Anterior
          </Button>
          <span className="text-sm text-zinc-400">
            Página <strong>{page}</strong> de {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors hover:opacity-90 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Próxima →
          </Button>
        </div>
      )}
    </main>
  )
}

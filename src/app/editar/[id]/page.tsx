'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { ProductInput, productSchema } from '@/lib/validators/product'

import {
  FiCalendar,
  FiEdit,
  FiHash,
  FiPackage,
  FiTag,
  FiX,
} from 'react-icons/fi'

export default function EditarProdutoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error()

        const produto = await res.json()
        reset(produto)
        setLoading(false)
      } catch (err) {
        console.error('Erro ao atualizar produto:', err)
        toast.error('Erro ao carregar produto')
        router.push('/produtos')
      }
    }

    fetchProduto()
  }, [id, reset, router])

  const onSubmit = async (data: ProductInput) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error()

      toast.success('Produto atualizado com sucesso!')
      setTimeout(() => {
        router.push('/')
      }, 1200)
    } catch (err) {
      toast.error('Erro ao atualizar produto')
      console.error(err)
    }
  }

  if (loading) return <p className="text-zinc-300">Carregando produto...</p>

  return (
    <main className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
        <FiEdit className="w-5 h-5" />
        Editar Produto
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name" className="flex items-center gap-1">
            <FiPackage className="w-4 h-4" />
            Nome
          </Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="expiresAt" className="flex items-center gap-1">
            <FiCalendar className="w-4 h-4" />
            Data de Vencimento
          </Label>
          <Input id="expiresAt" type="date" {...register('expiresAt')} />
          {errors.expiresAt && (
            <p className="text-red-500 text-xs">{errors.expiresAt.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="quantity" className="flex items-center gap-1">
            <FiHash className="w-4 h-4" />
            Quantidade
          </Label>
          <Input id="quantity" type="number" {...register('quantity')} />
          {errors.quantity && (
            <p className="text-red-500 text-xs">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category" className="flex items-center gap-1">
            <FiTag className="w-4 h-4" />
            Categoria
          </Label>
          <Input id="category" {...register('category')} />
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="transition-colors hover:opacity-90 cursor-pointer"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/')}
            className="flex items-center gap-1 transition-colors hover:opacity-90 cursor-pointer"
          >
            <FiX className="w-4 h-4" />
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  )
}

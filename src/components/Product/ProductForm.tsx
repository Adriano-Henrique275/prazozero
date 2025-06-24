'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { ProductInput, productSchema } from '@/lib/validators/product'

import {
  FiCalendar,
  FiClipboard,
  FiHash,
  FiPackage,
  FiSend,
  FiTag,
} from 'react-icons/fi'

export const ProductForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
  })

  const onSubmit = async (data: ProductInput) => {
    const promise = fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })

    toast.promise(promise, {
      loading: 'Salvando produto...',
      success: 'Produto cadastrado com sucesso! 🎉',
      error: 'Erro ao cadastrar produto 😢',
    })

    try {
      const res = await promise
      if (!res.ok) throw new Error()
      reset()
    } catch (err) {
      console.error(err)
      toast.error('Algo deu errado no cadastro!')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md w-full"
    >
      <div>
        <Label
          htmlFor="name"
          className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2"
        >
          <FiPackage className="w-4 h-4" />
          Nome do Produto
        </Label>
        <input
          id="name"
          {...register('name')}
          className="w-full bg-zinc-950 border border-zinc-600 text-zinc-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="expiresAt"
          className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2"
        >
          <FiCalendar className="w-4 h-4" />
          Data de Vencimento
        </Label>
        <input
          id="expiresAt"
          type="date"
          {...register('expiresAt')}
          className="w-full bg-zinc-950 border border-zinc-600 text-zinc-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition appearance-none cursor-pointer"
        />
        {errors.expiresAt && (
          <p className="text-red-500 text-xs mt-1">
            {errors.expiresAt.message}
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor="quantity"
          className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2"
        >
          <FiHash className="w-4 h-4" />
          Quantidade
        </Label>
        <input
          id="quantity"
          type="number"
          {...register('quantity')}
          className="w-full bg-zinc-950 border border-zinc-600 text-zinc-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
        />
        {errors.quantity && (
          <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="category"
          className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2"
        >
          <FiTag className="w-4 h-4" />
          Categoria
        </Label>
        <input
          id="category"
          {...register('category')}
          className="w-full bg-zinc-950 border border-zinc-600 text-zinc-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm transition-colors hover:opacity-90 cursor-pointer"
        >
          <FiSend className="w-4 h-4" />
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
        </Button>

        <Link href="/produtos">
          <Button
            variant="outline"
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm transition-colors hover:opacity-90 cursor-pointer"
          >
            <FiClipboard className="w-4 h-4" />
            Ver todos os produtos
          </Button>
        </Link>
      </div>
    </form>
  )
}

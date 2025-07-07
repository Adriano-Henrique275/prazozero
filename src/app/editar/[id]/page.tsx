'use client'

import { FiEdit, FiHash, FiPackage, FiTag, FiX } from 'react-icons/fi'

import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { Button } from '@/components/ui/Button'
import { DatePickerField } from '@/components/ui/DatePickerField'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

import { productUpdateSchema } from '@/lib/validators/productUpdate'

type ProductUpdateFormInput = z.input<typeof productUpdateSchema>

export default function EditarProdutoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductUpdateFormInput>({
    resolver: zodResolver(productUpdateSchema),
  })

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error()

        const produto = await res.json()

        reset({
          ...produto,
          expiresAt: new Date(produto.expiresAt),
        })

        setLoading(false)
      } catch (err) {
        console.error('Erro ao carregar produto:', err)
        toast.error('Erro ao carregar produto')
        router.push('/produtos')
      }
    }

    fetchProduto()
  }, [id, reset, router])

  const onSubmit: SubmitHandler<ProductUpdateFormInput> = async (data) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error()

      toast.success('Produto atualizado com sucesso!')
      setTimeout(() => router.push('/'), 1200)
    } catch (err) {
      console.error('Erro ao atualizar produto:', err)
      toast.error('Erro ao atualizar produto')
    }
  }

  if (loading) {
    return <p className="text-zinc-300">Carregando produto...</p>
  }

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

        <DatePickerField<ProductUpdateFormInput>
          control={control}
          name="expiresAt"
          label="Data de Vencimento"
          error={errors.expiresAt?.message}
        />

        <div>
          <Label htmlFor="quantity" className="flex items-center gap-1">
            <FiHash className="w-4 h-4" />
            Quantidade
          </Label>
          <Input
            id="quantity"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            {...register('quantity')}
            placeholder="Digite a quantidade"
          />

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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/')}
            className="flex items-center gap-1"
          >
            <FiX className="w-4 h-4" />
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  )
}

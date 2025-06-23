'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { ProductInput, productSchema } from '@/lib/validators/product'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

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
      if (!res.ok) throw new Error('Erro ao salvar')
      reset()
    } catch (err) {
      console.error(err)
      toast.error('Algo deu errado no cadastro!')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="name">Nome do Produto</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="expiresAt">Data de Vencimento</Label>
        <Input id="expiresAt" type="date" {...register('expiresAt')} />
        {errors.expiresAt && (
          <p className="text-red-500 text-xs">{errors.expiresAt.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="quantity">Quantidade</Label>
        <Input id="quantity" type="number" {...register('quantity')} />
        {errors.quantity && (
          <p className="text-red-500 text-xs">{errors.quantity.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="category">Categoria</Label>
        <Input id="category" {...register('category')} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
      </Button>

      <Link href="/produtos">
        <Button className="mt-4">Ver todos os produtos</Button>
      </Link>
    </form>
  )
}

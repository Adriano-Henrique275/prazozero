'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm, type SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { FiClipboard, FiHash, FiPackage, FiSend, FiTag } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { DatePickerField } from '@/components/ui/DatePickerField'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

import { productSchema } from '@/lib/validators/product'

type ProductFormInput = z.input<typeof productSchema>

export const ProductForm = () => {
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
  })

  const onSubmit: SubmitHandler<ProductFormInput> = async (data) => {
    const promise = fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    toast.promise(promise, {
      loading: 'Salvando produto...',
      success: 'Produto cadastrado com sucesso! 🎉',
      error: 'Erro ao cadastrar produto 😢',
    })

    try {
      const res = await promise
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(`Erro da API: ${res.status} - ${msg}`)
      }
      reset()
    } catch (err) {
      console.error(err)
      toast.error('Algo deu errado no cadastro!')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () => {
        toast.error('Preencha todos os campos obrigatórios corretamente 🚨')
      })}
      className="space-y-6 max-w-md w-full"
    >
      {/* Nome */}
      <div>
        <Label
          htmlFor="name"
          className="flex items-center gap-2 mb-2 text-sm font-medium text-zinc-300"
        >
          <FiPackage className="w-4 h-4" />
          Nome do Produto
        </Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Data de Vencimento */}
      <DatePickerField<ProductFormInput>
        control={control}
        name="expiresAt"
        label="Data de Vencimento"
        error={errors.expiresAt?.message}
      />

      {/* Quantidade */}
      <div>
        <Label
          htmlFor="quantity"
          className="flex items-center gap-2 mb-2 text-sm font-medium text-zinc-300"
        >
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
          <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
        )}
      </div>

      {/* Categoria */}
      <div>
        <Label
          htmlFor="category"
          className="flex items-center gap-2 mb-2 text-sm font-medium text-zinc-300"
        >
          <FiTag className="w-4 h-4" />
          Categoria
        </Label>
        <Input id="category" {...register('category')} />
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-2 pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <FiSend className="w-4 h-4" />
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
        </Button>

        <Link href="/produtos" className="w-full sm:w-auto">
          <Button
            variant="outline"
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <FiClipboard className="w-4 h-4" />
            Ver todos os produtos
          </Button>
        </Link>
      </div>
    </form>
  )
}

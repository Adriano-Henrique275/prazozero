import { ProductForm } from '@/components/Product/ProductForm'

export default function CadastrarPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-900">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Produto</h1>
      <ProductForm />
    </main>
  )
}

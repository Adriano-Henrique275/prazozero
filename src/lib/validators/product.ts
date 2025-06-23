import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  expiresAt: z.coerce.date({ required_error: 'Data obrigatória' }),
  quantity: z.coerce.number().min(1, 'Quantidade mínima 1'),
  category: z.string().optional(),
})

export type ProductInput = z.infer<typeof productSchema>

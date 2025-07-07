import { adaptDateInput } from '@/lib/date/adapters'
import { z } from 'zod'

export const productUpdateSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório').optional(),

  expiresAt: z.coerce
    .date() // ← aceita '2025-07-03' ou Date
    .optional()
    .transform((val) => (val ? adaptDateInput(val) : undefined)),

  quantity: z.coerce.number().min(1, 'Quantidade mínima 1').optional(),

  category: z.string().optional(),
})

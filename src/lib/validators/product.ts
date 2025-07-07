import { adaptDateInput } from '@/lib/date/adapters'
import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),

  expiresAt: z.coerce
    .date({ required_error: 'Data obrigatória' }) // ← aceita string ISO ou Date
    .transform(adaptDateInput), // ← converte para UTC fixo (12h) e elimina bug de fuso

  quantity: z.coerce.number().min(1, 'Quantidade mínima 1'),

  category: z.string().optional(),
})

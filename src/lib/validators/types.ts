// src/lib/validators/types.ts

export type ProductFormInput = {
  name: string
  expiresAt: string // ← do input type="date"
  quantity: number
  category?: string
}

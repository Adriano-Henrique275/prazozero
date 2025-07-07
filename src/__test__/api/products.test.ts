// src/__test__/api/products.test.ts
import { GET } from '@/app/api/products/route'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'uuid123',
          name: 'Arroz',
          expiresAt: new Date(),
          quantity: 10,
          category: 'Alimentos',
          status: 'ATIVO',
          removedAt: null,
          removalReason: null,
          createdAt: new Date(),
        },
      ]),
    },
  },
}))

describe.only('GET /api/products', () => {
  it('retorna produtos com sucesso', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0]).toHaveProperty('name', 'Arroz')
    expect(data[0]).toHaveProperty('status', 'ATIVO')
  })
})

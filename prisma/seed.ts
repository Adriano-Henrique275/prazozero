import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.product.deleteMany()

  await prisma.product.createMany({
    data: [
      // Produtos ATIVOS
      {
        name: 'Leite Integral',
        quantity: 12,
        category: 'Laticínios',
        expiresAt: new Date('2025-07-20T12:00:00'),
        status: 'ATIVO',
      },
      {
        name: 'Arroz Parboilizado',
        quantity: 50,
        category: 'Grãos',
        expiresAt: new Date('2025-08-01T12:00:00'),
        status: 'ATIVO',
      },
      {
        name: 'Frango Congelado',
        quantity: 20,
        category: 'Carnes',
        expiresAt: new Date('2025-07-25T12:00:00'),
        status: 'ATIVO',
      },

      // Produtos VENCIDOS
      {
        name: 'Suco de Laranja',
        quantity: 10,
        category: 'Bebidas',
        expiresAt: new Date('2025-06-15T12:00:00'),
        status: 'VENCIDO',
      },
      {
        name: 'Pão de Forma',
        quantity: 8,
        category: 'Padaria',
        expiresAt: new Date('2025-06-20T12:00:00'),
        status: 'VENCIDO',
      },
      {
        name: 'Iogurte Natural',
        quantity: 5,
        category: 'Laticínios',
        expiresAt: new Date('2025-06-22T12:00:00'),
        status: 'VENCIDO',
      },

      // Produtos REMOVIDOS
      {
        name: 'Maionese',
        quantity: 4,
        category: 'Condimentos',
        expiresAt: new Date('2025-06-15T12:00:00'),
        status: 'REMOVIDO',
        removedAt: new Date('2025-06-26T14:00:00'),
        removalReason: 'Vencido e recolhido manualmente',
      },
      {
        name: 'Bolo de Chocolate',
        quantity: 2,
        category: 'Confeitaria',
        expiresAt: new Date('2025-06-10T12:00:00'),
        status: 'REMOVIDO',
        removedAt: new Date('2025-06-25T10:30:00'),
        removalReason: 'Produto danificado',
      },
      {
        name: 'Queijo Minas',
        quantity: 6,
        category: 'Laticínios',
        expiresAt: new Date('2025-06-17T12:00:00'),
        status: 'REMOVIDO',
        removedAt: new Date('2025-06-26T09:00:00'),
        removalReason: 'Retirado após vencimento automático',
      },
      {
        name: 'Água Tônica',
        quantity: 24,
        category: 'Bebidas',
        expiresAt: new Date('2025-07-01T12:00:00'),
        status: 'REMOVIDO',
        removedAt: new Date('2025-06-27T08:00:00'),
        removalReason: 'Erro de cadastro',
      },
    ],
  })

  console.log('🧪 Seed executado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

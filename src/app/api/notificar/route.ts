import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  // Definir intervalo de hoje em UTC (00:00 até 23:59)
  const hoje = new Date()
  hoje.setUTCHours(0, 0, 0, 0)

  const amanha = new Date(hoje)
  amanha.setUTCDate(hoje.getUTCDate() + 1)

  // Buscar produtos vencendo hoje
  const produtosVencendoHoje = await prisma.product.findMany({
    where: {
      expiresAt: {
        gte: hoje,
        lt: amanha,
      },
    },
  })

  if (produtosVencendoHoje.length === 0) {
    return NextResponse.json({ message: 'Nenhum produto vencendo hoje.' })
  }

  // Disparo de notificação via OneSignal
  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
      included_segments: ['Subscribed Users'],
      headings: { en: '⏰ Produto vencendo hoje!' },
      contents: {
        en: `Você tem ${produtosVencendoHoje.length} produto${
          produtosVencendoHoje.length > 1 ? 's' : ''
        } vencendo hoje. Dá uma olhada no PrazoZero!`,
      },
      url: 'https://prazozero.vercel.app',
      ttl: 86400,
    }),
  })

  return NextResponse.json({
    enviado: true,
    total: produtosVencendoHoje.length,
  })
}

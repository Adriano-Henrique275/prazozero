import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  try {
    const vencendoHoje = await prisma.product.findMany({
      where: {
        expiresAt: {
          gte: start,
          lte: end,
        },
      },
    })

    if (vencendoHoje.length === 0) {
      return NextResponse.json({ message: 'Nada vencendo hoje.' })
    }

    // ✅ Pega os dados da Z-API via variáveis de ambiente
    const phoneNumber = process.env.ZAPI_PHONE!
    const instance = process.env.ZAPI_INSTANCE_ID!
    const token = process.env.ZAPI_TOKEN!

    const message = `⚠️ Olá! ${vencendoHoje.length} produto${
      vencendoHoje.length > 1 ? 's' : ''
    } vence hoje:\n\n${vencendoHoje.map((p) => `• ${p.name}`).join('\n')}`

    const response = await fetch(
      `https://api.z-api.io/instances/${instance}/token/${token}/send-message`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, message }),
      },
    )

    const respostaZAPI = await response.text()

    if (!response.ok) {
      console.error('Erro ao enviar para Z-API:', respostaZAPI)
      return NextResponse.json(
        { error: 'Falha no envio da mensagem.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: '✅ Notificação enviada com sucesso no WhatsApp!',
      detalhe: respostaZAPI,
    })
  } catch (err) {
    console.error('Erro interno:', err)
    return NextResponse.json(
      { error: 'Erro interno ao processar a notificação.' },
      { status: 500 },
    )
  }
}

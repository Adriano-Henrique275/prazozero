import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { OneSignalProvider } from '../components/OnSignalProvider'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PrazoZero',
  description: 'Controle de validade sem estresse',
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${roboto.variable} font-sans bg-zinc-950 text-zinc-100 antialiased min-h-screen`}
      >
        <ServiceWorkerRegister />
        <OneSignalProvider />

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#f4f4f5',
              border: '1px solid #3f3f46',
            },
          }}
        />

        {children}
      </body>
    </html>
  )
}

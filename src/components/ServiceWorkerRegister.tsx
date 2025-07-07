'use client'

import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ SW registrado com sucesso:', registration)

          registration.onupdatefound = () => {
            const newWorker = registration.installing
            newWorker?.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                toast('🆕 Nova versão disponível!', {
                  icon: '🔄',
                  style: {
                    background: '#1f1f1f',
                    color: '#60a5fa',
                    border: '1px solid #2563eb',
                  },
                  position: 'bottom-right',
                })
              }
            })
          }
        })
        .catch((err) => console.error('❌ Erro ao registrar SW:', err))
    }
  }, [])

  return null
}

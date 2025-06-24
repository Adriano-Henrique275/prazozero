'use client'

import { useEffect } from 'react'
import OneSignal from 'react-onesignal'

export function OneSignalProvider() {
  useEffect(() => {
    OneSignal.init({
      appId: 'SEU_APP_ID_DO_ONESIGNAL',
      notifyButton: {
        enable: true,
        prenotify: true,
        showCredit: false,
        text: {
          'tip.state.unsubscribed': 'Ativar notificações',
          'tip.state.subscribed': 'Você já está inscrito',
          'tip.state.blocked': 'Notificações bloqueadas',
          'message.prenotify': 'Clique para ativar as notificações',
          'message.action.subscribing': 'Ativando notificações...',
          'message.action.subscribed': 'Inscrição ativada!',
          'message.action.resubscribed': 'Você ativou novamente!',
          'message.action.unsubscribed': 'Você desativou as notificações',
          'dialog.main.title': 'Gerenciar Notificações',
          'dialog.main.button.subscribe': 'Ativar',
          'dialog.main.button.unsubscribe': 'Desativar',
          'dialog.blocked.title': 'Desbloqueie as notificações',
          'dialog.blocked.message':
            'Siga as instruções para permitir notificações:',
        },
      },
    })
  }, [])

  return null
}

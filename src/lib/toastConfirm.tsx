import { ReactNode } from 'react'
import toast from 'react-hot-toast'
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi'

type ToastType = 'danger' | 'info' | 'success'

type Options = {
  message: string | ReactNode
  onConfirm: () => void | Promise<void>
  confirmLabel?: string
  cancelLabel?: string
  type?: ToastType
  showSuccessToast?: boolean
}

const typeStyles: Record<ToastType, string> = {
  danger: 'border-red-500 text-red-400',
  info: 'border-blue-500 text-blue-400',
  success: 'border-green-500 text-green-400',
}

const icons: Record<ToastType, React.ReactNode> = {
  danger: <FiAlertCircle className="w-4 h-4 text-red-400" />,
  info: <FiInfo className="w-4 h-4 text-blue-400" />,
  success: <FiCheckCircle className="w-4 h-4 text-green-400" />,
}

export function toastConfirm({
  message,
  onConfirm,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  type = 'danger',
  showSuccessToast = false,
}: Options) {
  toast.dismiss()

  toast.custom((t) => (
    <div
      className={`bg-zinc-800 px-4 py-3 rounded shadow-lg border max-w-md flex items-start gap-3 ${typeStyles[type]}`}
    >
      <div>{icons[type]}</div>
      <div className="flex-1 text-sm text-zinc-100">{message}</div>
      <div className="flex gap-2 ml-auto mt-1">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-xs text-zinc-400 hover:text-zinc-200"
        >
          {cancelLabel}
        </button>
        <button
          onClick={async () => {
            toast.dismiss(t.id)
            await onConfirm()
            if (showSuccessToast) {
              toast.success('Confirmado com sucesso ✅')
            }
          }}
          className={`text-xs font-semibold hover:opacity-90 ${
            type === 'danger'
              ? 'text-red-400 hover:text-red-300'
              : type === 'success'
              ? 'text-green-400 hover:text-green-300'
              : 'text-blue-400 hover:text-blue-300'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  ))
}

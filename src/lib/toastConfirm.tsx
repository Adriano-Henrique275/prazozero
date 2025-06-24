import { ReactNode } from 'react'
import toast from 'react-hot-toast'

type Options = {
  message: string | ReactNode
  onConfirm: () => void | Promise<void>
  confirmLabel?: string
  cancelLabel?: string
}

export function toastConfirm({
  message,
  onConfirm,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}: Options) {
  toast.custom((t) => (
    <div className="bg-zinc-800 text-zinc-100 px-4 py-3 rounded shadow-lg border border-red-500 flex items-center gap-4 max-w-md">
      <div className="text-sm flex-1">{message}</div>
      <div className="flex gap-2 ml-auto">
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
          }}
          className="text-xs text-red-400 hover:text-red-300 font-semibold"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  ))
}

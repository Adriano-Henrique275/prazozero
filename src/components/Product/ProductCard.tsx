import { Button } from '@/components/ui/Button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FiEdit, FiTag, FiTrash2 } from 'react-icons/fi'

type ProductCardProps = {
  id: string
  name: string
  expiresAt: string
  category?: string | undefined
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
}

export const ProductCard = ({
  id,
  name,
  expiresAt,
  category,
  onDelete,
  onEdit,
}: ProductCardProps) => {
  const expireDate = new Date(expiresAt)
  const today = new Date()

  const formattedDate = format(expireDate, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  const isExpired = expireDate < today
  const isCloseToExpire =
    !isExpired &&
    expireDate.getTime() - today.getTime() < 1000 * 60 * 60 * 24 * 7

  const badge = (() => {
    if (isExpired) {
      return {
        label: 'Vencido',
        style: 'bg-red-700 text-red-100 border border-red-500',
      }
    }

    if (isCloseToExpire) {
      return {
        label: 'Vencendo',
        style: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500',
      }
    }

    return {
      label: 'Ok',
      style: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500',
    }
  })()

  return (
    <div className="bg-zinc-800 border border-zinc-600 rounded-lg shadow-md p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-zinc-100">{name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded ${badge.style}`}>
          {badge.label}
        </span>
      </div>

      <p className="text-sm text-zinc-400">
        Validade:{' '}
        <span className="text-zinc-100 font-medium">{formattedDate}</span>
      </p>

      {category && (
        <p className="text-xs text-zinc-500 italic flex items-center gap-1">
          <FiTag className="w-4 h-4" />
          {category}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <Button
          variant="outline"
          type="button"
          className="text-sm flex items-center gap-1 transition-colors hover:opacity-90 cursor-pointer"
          onClick={() => onEdit?.(id)}
        >
          <FiEdit className="w-4 h-4" />
          Editar
        </Button>
        <Button
          variant="secondary"
          type="button"
          className="text-sm flex items-center gap-1 transition-colors hover:opacity-90 cursor-pointer"
          onClick={() => onDelete?.(id)}
        >
          <FiTrash2 className="w-4 h-4" />
          Deletar
        </Button>
      </div>
    </div>
  )
}

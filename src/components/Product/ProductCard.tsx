import { Button } from '@/components/ui/Button'
import { SafeDate } from '@/lib/date/SafeDate'
import { FiEdit, FiTag, FiTrash2 } from 'react-icons/fi'

export type ProductCardProps = {
  id: string
  name: string
  expiresAt: string
  category?: string
  status?: 'ATIVO' | 'VENCIDO' | 'REMOVIDO'
  removalReason?: string | null
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  disabled?: boolean
}

export const ProductCard = ({
  id,
  name,
  expiresAt,
  category,
  status = 'ATIVO',
  removalReason,
  onDelete,
  onEdit,
  disabled = false,
}: ProductCardProps) => {
  const expireDate = new SafeDate(expiresAt)
  const formattedDate = expireDate.toDateBR()
  const today = new Date()

  const isExpired = expireDate.isBeforeToday()
  const isCloseToExpire =
    !isExpired &&
    expireDate.toDate().getTime() - today.getTime() < 1000 * 60 * 60 * 24 * 7

  const finalStatus = status === 'ATIVO' && isExpired ? 'VENCIDO' : status

  const statusBadge = (() => {
    switch (finalStatus) {
      case 'REMOVIDO':
        return {
          label: 'Removido',
          style: 'bg-zinc-700 text-zinc-300 border border-zinc-500',
        }
      case 'VENCIDO':
        return {
          label: 'Vencido',
          style: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500',
        }
      default:
        return isCloseToExpire
          ? {
              label: 'Vencendo',
              style:
                'bg-yellow-500/20 text-yellow-300 border border-yellow-500',
            }
          : {
              label: 'Ok',
              style:
                'bg-emerald-500/10 text-emerald-300 border border-emerald-500',
            }
    }
  })()

  const isRemovedAfterExpiration =
    finalStatus === 'REMOVIDO' &&
    removalReason?.toLowerCase().includes('vencimento')

  return (
    <div className="bg-zinc-800 border border-zinc-600 rounded-lg shadow-md p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-zinc-100">{name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded ${statusBadge.style}`}>
          {statusBadge.label}
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

      {isRemovedAfterExpiration && (
        <span className="inline-block mt-1 text-[10px] uppercase tracking-wide text-red-400 bg-red-900/20 px-2 py-0.5 rounded">
          Retirado após vencimento
        </span>
      )}

      {finalStatus === 'REMOVIDO' && removalReason && (
        <p className="text-xs text-zinc-500 italic mt-1">
          Motivo: {removalReason}
        </p>
      )}

      {!disabled && (
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
      )}
    </div>
  )
}

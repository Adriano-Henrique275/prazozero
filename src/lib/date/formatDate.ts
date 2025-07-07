import { format, toZonedTime } from 'date-fns-tz'
import { ptBR } from 'date-fns/locale'

export function formatDate(
  isoString: string,
  pattern = "dd 'de' MMMM 'de' yyyy",
): string {
  const timeZone = 'America/Sao_Paulo'
  const paddedISO = isoString.length <= 10 ? `${isoString}T12:00:00` : isoString
  const zoned = toZonedTime(paddedISO, timeZone)

  return format(zoned, pattern, { locale: ptBR })
}

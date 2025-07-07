import { SafeDate } from './SafeDate'

/** Converte input (string ou Date) para Date seguro com horário fixo (12h UTC) */
export function adaptDateInput(input: string | Date): Date {
  return new SafeDate(input).toDate()
}

/** Formata um Date como 'yyyy-MM-dd' (ideal para <input type="date" /> e APIs) */
export function adaptDateOutput(date: Date): string {
  return new SafeDate(date).toDateOnly()
}

/** Formata um Date no estilo brasileiro 'dd/mm/yyyy' para UI */
export function adaptDateBR(date: Date): string {
  return new SafeDate(date).toDateBR()
}

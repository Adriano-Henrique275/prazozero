'use client'

import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'

import { maskUtils } from '@/lib/utils/maskUtils'
import { Input } from './Input'
import { Label } from './Label'

type DatePickerFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  error?: string
}

// 🧠 Verificação segura
function isValidDate(value: unknown): value is Date {
  return typeof value === 'object' && value instanceof Date
}

export function DatePickerField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  error,
}: DatePickerFieldProps<TFieldValues>) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const visualValue = isValidDate(field.value)
            ? format(field.value, 'dd/MM/yyyy', { locale: ptBR })
            : typeof field.value === 'string'
            ? field.value
            : ''

          return (
            <Input
              id={name}
              type="text"
              placeholder="dd/mm/aaaa"
              value={visualValue}
              onChange={(e) => {
                const texto = maskUtils.dateBR(e.target.value)
                field.onChange(texto) // mantém reatividade da digitação

                const partes = texto.split('/')
                if (
                  partes.length === 3 &&
                  partes.every((v) => typeof v === 'string' && v.length >= 2)
                ) {
                  const [dia, mes, ano] = partes
                  if (ano.length === 4) {
                    const parsed = parse(
                      `${ano}-${mes}-${dia}`,
                      'yyyy-MM-dd',
                      new Date(),
                    )
                    field.onChange(parsed)
                  }
                }
              }}
            />
          )
        }}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}

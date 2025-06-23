import { LabelHTMLAttributes } from 'react'

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export const Label = ({ children, ...props }: LabelProps) => {
  return (
    <label className="block text-sm font-medium mb-1" {...props}>
      {children}
    </label>
  )
}

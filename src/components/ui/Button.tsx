import clsx from 'clsx'
import { ButtonHTMLAttributes } from 'react'

type Variant = 'default' | 'outline' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export const Button = ({
  children,
  variant = 'default',
  className,
  ...props
}: ButtonProps) => {
  const baseStyle = 'px-4 py-2 rounded text-sm font-medium transition'

  const variants: Record<Variant, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  }

  return (
    <button
      className={clsx(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}

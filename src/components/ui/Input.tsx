import { InputHTMLAttributes, forwardRef } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    return (
      <input
        ref={ref}
        className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

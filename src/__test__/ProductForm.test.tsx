import { ProductForm } from '@/components/Product/ProductForm'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

describe('ProductForm', () => {
  it('deve renderizar todos os campos obrigatórios', () => {
    render(<ProductForm />)

    expect(screen.getByLabelText(/nome do produto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/data de vencimento/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/quantidade/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /cadastrar produto/i }),
    ).toBeInTheDocument()
  })

  it('deve exibir erros se submeter sem preencher campos', async () => {
    render(<ProductForm />)

    const submit = screen.getByRole('button', { name: /cadastrar produto/i })
    await userEvent.click(submit)

    await waitFor(() => {
      // Usa matchers flexíveis para garantir detecção
      expect(screen.getByText(/nome obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/quantidade mínima/i)).toBeInTheDocument()
    })
  })

  it('deve submeter se os campos forem válidos', async () => {
    render(<ProductForm />)

    await userEvent.type(screen.getByLabelText(/nome do produto/i), 'Sabonete')
    await userEvent.type(
      screen.getByLabelText(/data de vencimento/i),
      '2025-12-25',
    )
    await userEvent.type(screen.getByLabelText(/quantidade/i), '3')

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('ok'),
      } as Response),
    )

    const submit = screen.getByRole('button', { name: /cadastrar produto/i })
    await userEvent.click(submit)

    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})

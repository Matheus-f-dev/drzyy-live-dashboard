import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { OrderForm } from '../components/guest-modal/order-form/order-form'

const renderForm = () => {
  const onAdd = vi.fn()
  render(<OrderForm onAdd={onAdd} />)
  return { onAdd }
}

const fill = async (product: string, quantity: string, unitPrice: string) => {
  if (product)    await userEvent.type(screen.getByLabelText('Produto'), product)
  if (quantity)   await userEvent.type(screen.getByLabelText('Qtd.'), quantity)
  if (unitPrice)  await userEvent.type(screen.getByLabelText('Preço unit.'), unitPrice)
}

const submit = () => userEvent.click(screen.getByRole('button', { name: /adicionar/i }))

describe('OrderForm — submissão válida', () => {
  it('chama onAdd com os dados corretos e limpa os campos', async () => {
    const { onAdd } = renderForm()
    await fill('Cerveja', '2', '8.50')
    await submit()

    expect(onAdd).toHaveBeenCalledOnce()
    expect(onAdd).toHaveBeenCalledWith({ product: 'Cerveja', quantity: 2, unitPrice: 8.5 })
    expect(screen.getByLabelText('Produto')).toHaveValue('')
  })
})

describe('OrderForm — erros de validação', () => {
  it('exibe erro quando produto está vazio', async () => {
    renderForm()
    await submit()
    expect(await screen.findByText('Informe o produto')).toBeInTheDocument()
  })

  it('exibe erro quando quantidade é zero', async () => {
    renderForm()
    await fill('', '0', '')
    await submit()
    expect(await screen.findByText('Mínimo 1')).toBeInTheDocument()
  })

  it('exibe erro quando preço é zero', async () => {
    renderForm()
    await fill('Água', '1', '0')
    await submit()
    expect(await screen.findByText('Informe o preço')).toBeInTheDocument()
  })

  it('não chama onAdd quando há erros', async () => {
    const { onAdd } = renderForm()
    await submit()
    expect(onAdd).not.toHaveBeenCalled()
  })
})

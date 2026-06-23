import type { OrderItem } from '../types'

const calcTotal = (items: OrderItem[]) =>
  items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)

const item = (product: string, quantity: number, unitPrice: number): OrderItem => ({
  id: product,
  product,
  quantity,
  unitPrice,
})

describe('cálculo do total', () => {
  it('retorna 0 para lista vazia', () => {
    expect(calcTotal([])).toBe(0)
  })

  it('calcula subtotal de item único (quantidade × preço)', () => {
    expect(calcTotal([item('Cerveja', 3, 8)])).toBe(24)
  })

  it('soma os subtotais de múltiplos itens', () => {
    expect(calcTotal([item('Cerveja', 2, 8), item('Água', 3, 3)])).toBe(25)
  })

  it('lida com valores decimais sem perda de precisão relevante', () => {
    expect(calcTotal([item('Vinho', 1, 49.9), item('Taça', 2, 5.05)])).toBeCloseTo(60)
  })

  it('reflete atualização de quantidade', () => {
    const items = [item('Suco', 1, 10)]
    const updated = items.map((i) => ({ ...i, quantity: 4 }))
    expect(calcTotal(updated)).toBe(40)
  })
})

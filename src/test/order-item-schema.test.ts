import { orderItemSchema } from '../types'

const valid = { product: 'Cerveja', quantity: 2, unitPrice: 8.5 }

describe('validação do schema — casos válidos', () => {
  it('aceita dados válidos', () => {
    expect(orderItemSchema.safeParse(valid).success).toBe(true)
  })

  it('converte quantity e unitPrice vindos como string (input do formulário)', () => {
    const result = orderItemSchema.safeParse({ product: 'Água', quantity: '3', unitPrice: '4.50' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.quantity).toBe(3)
      expect(result.data.unitPrice).toBe(4.5)
    }
  })
})

describe('validação do schema — campo product', () => {
  it('rejeita produto vazio', () => {
    const result = orderItemSchema.safeParse({ ...valid, product: '' })
    expect(result.success).toBe(false)
    if (!result.success)
      expect(result.error.flatten().fieldErrors.product).toContain('Informe o produto')
  })
})

describe('validação do schema — campo quantity', () => {
  it('rejeita quantidade zero', () => {
    const result = orderItemSchema.safeParse({ ...valid, quantity: 0 })
    expect(result.success).toBe(false)
    if (!result.success)
      expect(result.error.flatten().fieldErrors.quantity).toContain('Mínimo 1')
  })

  it('rejeita quantidade negativa', () => {
    const result = orderItemSchema.safeParse({ ...valid, quantity: -1 })
    expect(result.success).toBe(false)
  })

  it('rejeita quantidade fracionada', () => {
    const result = orderItemSchema.safeParse({ ...valid, quantity: 1.5 })
    expect(result.success).toBe(false)
  })
})

describe('validação do schema — campo unitPrice', () => {
  it('rejeita preço zero', () => {
    const result = orderItemSchema.safeParse({ ...valid, unitPrice: 0 })
    expect(result.success).toBe(false)
    if (!result.success)
      expect(result.error.flatten().fieldErrors.unitPrice).toContain('Informe o preço')
  })

  it('rejeita preço negativo', () => {
    const result = orderItemSchema.safeParse({ ...valid, unitPrice: -5 })
    expect(result.success).toBe(false)
  })

  it('aceita o menor preço válido (0.01)', () => {
    expect(orderItemSchema.safeParse({ ...valid, unitPrice: 0.01 }).success).toBe(true)
  })
})

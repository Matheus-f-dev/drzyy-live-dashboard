import { useOrderStore } from '../store/order-store'

const GUEST = 'guest-1'

beforeEach(() => {
  useOrderStore.setState({ orders: {} })
})

describe('addItem', () => {
  it('cria a comanda e adiciona o primeiro item', () => {
    useOrderStore.getState().addItem(GUEST, { product: 'Cerveja', quantity: 2, unitPrice: 8 })

    const { items } = useOrderStore.getState().getOrder(GUEST)
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ product: 'Cerveja', quantity: 2, unitPrice: 8 })
  })

  it('acumula múltiplos itens na mesma comanda', () => {
    const { addItem, getOrder } = useOrderStore.getState()
    addItem(GUEST, { product: 'Cerveja', quantity: 1, unitPrice: 8 })
    addItem(GUEST, { product: 'Água', quantity: 3, unitPrice: 3 })

    expect(getOrder(GUEST).items).toHaveLength(2)
  })

  it('mantém comandas de guests diferentes isoladas', () => {
    useOrderStore.getState().addItem('guest-A', { product: 'Suco', quantity: 1, unitPrice: 5 })
    useOrderStore.getState().addItem('guest-B', { product: 'Café', quantity: 1, unitPrice: 4 })

    expect(useOrderStore.getState().getOrder('guest-A').items).toHaveLength(1)
    expect(useOrderStore.getState().getOrder('guest-B').items).toHaveLength(1)
  })
})

describe('removeItem', () => {
  it('remove o item correto pelo id', () => {
    const { addItem, removeItem, getOrder } = useOrderStore.getState()
    addItem(GUEST, { product: 'Cerveja', quantity: 1, unitPrice: 8 })
    addItem(GUEST, { product: 'Água', quantity: 2, unitPrice: 3 })

    const [first] = getOrder(GUEST).items
    removeItem(GUEST, first.id)

    const remaining = getOrder(GUEST).items
    expect(remaining).toHaveLength(1)
    expect(remaining[0].product).toBe('Água')
  })

  it('não altera o estado se o guestId não existir', () => {
    const before = useOrderStore.getState().orders
    useOrderStore.getState().removeItem('inexistente', 'item-99')
    expect(useOrderStore.getState().orders).toEqual(before)
  })
})

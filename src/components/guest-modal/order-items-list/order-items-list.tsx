import type { OrderItem } from '../../../types'
import styles from './order-items-list.module.css'

interface OrderItemsListProps {
  items: OrderItem[]
  onRemove: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
}

const fmt = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function OrderItemsList({ items, onRemove, onUpdateQuantity }: OrderItemsListProps) {
  if (items.length === 0) {
    return <p className={styles.empty}>Nenhum item adicionado.</p>
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.product}>{item.product}</span>
              <span className={styles.price}>{fmt(item.unitPrice)} / un.</span>
            </div>

            <div className={styles.itemRight}>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Diminuir quantidade"
                >−</button>
                <span className={styles.qtyValue}>{item.quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  aria-label="Aumentar quantidade"
                >+</button>
              </div>

              <span className={styles.subtotal}>{fmt(item.quantity * item.unitPrice)}</span>

              <button
                className={styles.removeBtn}
                onClick={() => onRemove(item.id)}
                aria-label="Remover item"
              >✕</button>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>{fmt(total)}</span>
      </div>
    </div>
  )
}

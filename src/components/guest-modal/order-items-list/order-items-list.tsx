import type { OrderItem } from '../../../types'
import styles from './order-items-list.module.css'

interface OrderItemsListProps {
  items: OrderItem[]
}

const fmt = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function OrderItemsList({ items }: OrderItemsListProps) {
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
              <span className={styles.qty}>{item.quantity}×  {fmt(item.unitPrice)}</span>
            </div>
            <span className={styles.subtotal}>{fmt(item.quantity * item.unitPrice)}</span>
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

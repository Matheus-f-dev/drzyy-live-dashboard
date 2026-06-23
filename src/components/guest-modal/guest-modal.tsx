import { AppModal } from '../app-modal'
import type { Guest } from '../../types'
import { useOrderStore } from '../../store'
import { OrderForm } from './order-form'
import { OrderItemsList } from './order-items-list'
import styles from './guest-modal.module.css'

interface GuestModalProps {
  guest: Guest | null
  onClose: () => void
}

export function GuestModal({ guest, onClose }: GuestModalProps) {
  const { addItem, removeItem, updateQuantity, getOrder } = useOrderStore()
  const order = guest ? getOrder(guest.id) : { guestId: '', items: [] }

  return (
    <AppModal
      isOpen={guest !== null}
      title="Comanda"
      onClose={onClose}
    >
      {guest && (
        <div className={styles.content}>

          <div className={styles.avatarRow}>
            <div className={`${styles.avatar} ${guest.isVip ? styles.avatarVip : ''}`}>
              {guest.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.identity}>
              <span className={styles.name}>{guest.name}</span>
              <span className={styles.id}>{guest.id}</span>
            </div>
          </div>

          <div className={styles.divider} />

          <OrderForm onAdd={(data) => addItem(guest.id, data)} />

          <OrderItemsList
            items={order.items}
            onRemove={(itemId) => removeItem(guest.id, itemId)}
            onUpdateQuantity={(itemId, qty) => updateQuantity(guest.id, itemId, qty)}
          />

          <dl className={styles.fields}>
            <div className={styles.field}>
              <dt className={styles.fieldLabel}>Status</dt>
              <dd className={styles.fieldValue}>
                {guest.isVip
                  ? <span className={`${styles.badge} ${styles.badgeVip}`}>⭐ VIP</span>
                  : <span className={`${styles.badge} ${styles.badgeStd}`}>Padrão</span>
                }
              </dd>
            </div>

            <div className={styles.field}>
              <dt className={styles.fieldLabel}>Idade</dt>
              <dd className={styles.fieldValue}>{guest.age} anos</dd>
            </div>

            <div className={styles.field}>
              <dt className={styles.fieldLabel}>Entrada</dt>
              <dd className={styles.fieldValue}>
                <code className={styles.code}>{guest.enteredAt}</code>
              </dd>
            </div>
          </dl>

        </div>
      )}
    </AppModal>
  )
}

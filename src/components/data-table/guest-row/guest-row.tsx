import type { Guest } from '../../../types'
import { VipBadge } from '../vip-badge'
import styles from './guest-row.module.css'

interface GuestRowProps {
  guest: Guest
  isNew: boolean
}

export function GuestRow({ guest, isNew }: GuestRowProps) {
  return (
    <tr className={`${styles.row} ${isNew ? styles.rowNew : ''}`}>
      <td className={styles.td}>
        <span className={styles.name}>{guest.name}</span>
      </td>
      <td className={styles.td}>
        <span className={styles.age}>{guest.age}</span>
        <span className={styles.ageLabel}> anos</span>
      </td>
      <td className={styles.td}>
        <VipBadge isVip={guest.isVip} />
      </td>
      <td className={styles.td}>
        <code className={styles.time}>{guest.enteredAt}</code>
      </td>
    </tr>
  )
}

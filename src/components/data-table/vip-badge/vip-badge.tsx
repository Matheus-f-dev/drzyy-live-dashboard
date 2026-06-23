import styles from './vip-badge.module.css'

interface VipBadgeProps {
  isVip: boolean
}

export function VipBadge({ isVip }: VipBadgeProps) {
  return isVip
    ? <span className={`${styles.badge} ${styles.vip}`}>⭐ VIP</span>
    : <span className={`${styles.badge} ${styles.std}`}>Padrão</span>
}

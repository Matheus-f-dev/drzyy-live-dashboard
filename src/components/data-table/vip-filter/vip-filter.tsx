import styles from './vip-filter.module.css'

interface VipFilterProps {
  checked: boolean
  onChange: () => void
}

export function VipFilter({ checked, onChange }: VipFilterProps) {
  return (
    <label className={`${styles.label} ${checked ? styles.active : ''}`}>
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label="Mostrar apenas clientes VIP"
      />
      <span className={styles.box}>
        {checked && <span className={styles.check}>✓</span>}
      </span>
      <span className={styles.text}>⭐ Apenas VIP</span>
    </label>
  )
}

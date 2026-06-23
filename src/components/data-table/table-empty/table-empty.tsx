import styles from './table-empty.module.css'

export function TableEmpty() {
  return (
    <tr>
      <td colSpan={4} className={styles.cell}>
        <span className={styles.icon}>🎙️</span>
        <p className={styles.text}>Aguardando primeiros registros...</p>
        <p className={styles.sub}>Novos clientes aparecerão aqui automaticamente</p>
      </td>
    </tr>
  )
}

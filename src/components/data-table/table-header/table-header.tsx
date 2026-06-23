import styles from './table-header.module.css'

const COLUMNS = ['Nome', 'Idade', 'VIP', 'Horário de Entrada']

export function TableHeader() {
  return (
    <thead>
      <tr>
        {COLUMNS.map((col) => (
          <th key={col} className={styles.th}>{col}</th>
        ))}
      </tr>
    </thead>
  )
}

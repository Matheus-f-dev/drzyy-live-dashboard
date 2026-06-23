import styles from './data-table.module.css'

const COLUMNS = ['ID', 'Nome', 'Status', 'Data', 'Valor', '']

const MOCK_ROWS = Array.from({ length: 6 }, (_, i) => ({
  id: `#${String(i + 1).padStart(4, '0')}`,
  name: '— — —',
  status: i % 3 === 0 ? 'Ativo' : i % 3 === 1 ? 'Pendente' : 'Inativo',
  date: '—',
  value: '—',
}))

const STATUS_CLASS: Record<string, string> = {
  Ativo: styles.statusActive,
  Pendente: styles.statusPending,
  Inativo: styles.statusInactive,
}

interface DataTableProps {
  onOpenModal: () => void
}

export function DataTable({ onOpenModal }: DataTableProps) {
  return (
    <section className={styles.wrapper} aria-label="Tabela de dados">
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>Registros</h2>
        <button className={styles.addBtn} onClick={onOpenModal}>
          + Novo registro
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col} className={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_ROWS.map((row) => (
              <tr key={row.id} className={styles.tr}>
                <td className={styles.td}><code className={styles.code}>{row.id}</code></td>
                <td className={styles.td}>{row.name}</td>
                <td className={styles.td}>
                  <span className={`${styles.status} ${STATUS_CLASS[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className={styles.td}>{row.date}</td>
                <td className={styles.td}>{row.value}</td>
                <td className={styles.tdActions}>
                  <button className={styles.actionBtn} onClick={onOpenModal}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

import { useLiveFeedStore } from '../../store'
import styles from './data-table.module.css'

const COLUMNS = ['ID', 'Nome', 'Idade', 'VIP', 'Entrada']

interface DataTableProps {
  onOpenModal: () => void
}

export function DataTable({ onOpenModal }: DataTableProps) {
  const guests = useLiveFeedStore((s) => s.guests)

  return (
    <section className={styles.wrapper} aria-label="Tabela de dados">
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>
          Feed ao vivo
          {guests.length > 0 && (
            <span className={styles.liveBadge}>● LIVE</span>
          )}
        </h2>
        <button className={styles.addBtn} onClick={onOpenModal}>
          + Novo registro
        </button>
      </div>

      <div className={styles.tableWrapper}>
        {guests.length === 0 ? (
          <p className={styles.empty}>Aguardando primeiros registros...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col} className={styles.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, index) => (
                <tr key={guest.id} className={`${styles.tr} ${index === 0 ? styles.trNew : ''}`}>
                  <td className={styles.td}><code className={styles.code}>{guest.id}</code></td>
                  <td className={styles.td}>{guest.name}</td>
                  <td className={styles.td}>{guest.age} anos</td>
                  <td className={styles.td}>
                    {guest.isVip
                      ? <span className={`${styles.badge} ${styles.badgeVip}`}>VIP</span>
                      : <span className={`${styles.badge} ${styles.badgeStd}`}>Padrão</span>
                    }
                  </td>
                  <td className={styles.td}><code className={styles.code}>{guest.enteredAt}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

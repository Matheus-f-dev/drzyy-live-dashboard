import { useLiveFeedStore } from '../../store'
import { TableHeader } from './table-header'
import { GuestRow } from './guest-row'
import { TableEmpty } from './table-empty'
import styles from './data-table.module.css'

interface DataTableProps {
  onOpenModal: () => void
}

export function DataTable({ onOpenModal }: DataTableProps) {
  const guests = useLiveFeedStore((s) => s.guests)
  const newestId = guests[0]?.id

  return (
    <section className={styles.wrapper} aria-label="Feed de clientes">
      <div className={styles.toolbar}>
        <div className={styles.titleGroup}>
          <h2 className={styles.heading}>Clientes</h2>
          {guests.length > 0 && (
            <span className={styles.count}>{guests.length}</span>
          )}
        </div>
        <button className={styles.addBtn} onClick={onOpenModal}>
          + Novo registro
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <TableHeader />
          <tbody>
            {guests.length === 0
              ? <TableEmpty />
              : guests.map((guest) => (
                  <GuestRow
                    key={guest.id}
                    guest={guest}
                    isNew={guest.id === newestId}
                  />
                ))
            }
          </tbody>
        </table>
      </div>
    </section>
  )
}

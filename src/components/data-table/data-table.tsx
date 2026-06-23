import { useMemo } from 'react'
import { useLiveFeedStore } from '../../store'
import { useSearch } from '../../hooks'
import { normalizeText } from '../../utils'
import { TableHeader } from './table-header'
import { GuestRow } from './guest-row'
import { TableEmpty } from './table-empty'
import { SearchInput } from './search-input'
import styles from './data-table.module.css'

interface DataTableProps {
  onOpenModal: () => void
}

export function DataTable({ onOpenModal }: DataTableProps) {
  const guests = useLiveFeedStore((s) => s.guests)
  const { query, setQuery, debounced } = useSearch()

  const filtered = useMemo(() => {
    if (!debounced) return guests
    const term = normalizeText(debounced)
    return guests.filter((g) => normalizeText(g.name).includes(term))
  }, [guests, debounced])

  const newestId = filtered[0]?.id === guests[0]?.id ? guests[0]?.id : undefined

  return (
    <section className={styles.wrapper} aria-label="Feed de clientes">
      <div className={styles.toolbar}>
        <div className={styles.titleGroup}>
          <h2 className={styles.heading}>Clientes</h2>
          {guests.length > 0 && (
            <span className={styles.count}>{guests.length}</span>
          )}
        </div>

        <div className={styles.toolbarRight}>
          <SearchInput
            value={query}
            onChange={setQuery}
            resultCount={filtered.length}
            totalCount={guests.length}
          />
          <button className={styles.addBtn} onClick={onOpenModal}>
            + Novo
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <TableHeader />
          <tbody>
            {filtered.length === 0
              ? <TableEmpty query={debounced} />
              : filtered.map((guest) => (
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

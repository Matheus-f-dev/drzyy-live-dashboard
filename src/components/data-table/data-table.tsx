import { useMemo } from 'react'
import { useLiveFeedStore } from '../../store'
import { useSearch, useVipFilter } from '../../hooks'
import { normalizeText } from '../../utils'
import { TableHeader } from './table-header'
import { GuestRow } from './guest-row'
import { TableEmpty } from './table-empty'
import { SearchInput } from './search-input'
import { VipFilter } from './vip-filter'
import styles from './data-table.module.css'

interface DataTableProps {
  onOpenModal: () => void
}

export function DataTable({ onOpenModal }: DataTableProps) {
  const guests              = useLiveFeedStore((s) => s.guests)
  const { query, setQuery, debounced } = useSearch()
  const { vipOnly, toggle } = useVipFilter()

  const filtered = useMemo(() => {
    let result = guests
    if (vipOnly)    result = result.filter((g) => g.isVip)
    if (debounced)  result = result.filter((g) => normalizeText(g.name).includes(normalizeText(debounced)))
    return result
  }, [guests, debounced, vipOnly])

  const isFiltering         = vipOnly || Boolean(debounced)
  const newestId            = !isFiltering ? guests[0]?.id : undefined

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
          <VipFilter checked={vipOnly} onChange={toggle} />
          <SearchInput
            value={query}
            onChange={setQuery}
            resultCount={isFiltering ? filtered.length : undefined}
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
              ? <TableEmpty query={debounced} vipOnly={vipOnly} />
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

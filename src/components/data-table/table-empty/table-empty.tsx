import styles from './table-empty.module.css'

interface TableEmptyProps {
  query?: string
  vipOnly?: boolean
}

export function TableEmpty({ query, vipOnly }: TableEmptyProps) {
  const isFiltered = Boolean(query) || vipOnly

  const icon = isFiltered ? '🔍' : '🎙️'
  const text = query && vipOnly
    ? `Nenhum VIP encontrado para "${query}"`
    : query
    ? `Nenhum resultado para "${query}"`
    : vipOnly
    ? 'Nenhum cliente VIP ainda'
    : 'Aguardando primeiros registros...'

  const sub = isFiltered
    ? 'Tente ajustar os filtros'
    : 'Novos clientes aparecerão aqui automaticamente'

  return (
    <tr>
      <td colSpan={4} className={styles.cell}>
        <span className={styles.icon}>{icon}</span>
        <p className={styles.text}>{text}</p>
        <p className={styles.sub}>{sub}</p>
      </td>
    </tr>
  )
}

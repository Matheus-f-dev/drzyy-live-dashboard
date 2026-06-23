import styles from './table-empty.module.css'

interface TableEmptyProps {
  query?: string
}

export function TableEmpty({ query }: TableEmptyProps) {
  const isFiltered = Boolean(query)

  return (
    <tr>
      <td colSpan={4} className={styles.cell}>
        <span className={styles.icon}>{isFiltered ? '🔍' : '🎙️'}</span>
        <p className={styles.text}>
          {isFiltered ? `Nenhum resultado para "${query}"` : 'Aguardando primeiros registros...'}
        </p>
        <p className={styles.sub}>
          {isFiltered ? 'Tente outro nome' : 'Novos clientes aparecerão aqui automaticamente'}
        </p>
      </td>
    </tr>
  )
}

import styles from './search-input.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  resultCount?: number
  totalCount?: number
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar por nome...',
  resultCount,
  totalCount,
}: SearchInputProps) {
  const isFiltering = value.length > 0

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <span className={styles.icon}>🔍</span>
        <input
          className={styles.input}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Buscar cliente por nome"
        />
        {isFiltering && (
          <button
            className={styles.clear}
            onClick={() => onChange('')}
            aria-label="Limpar busca"
          >
            ✕
          </button>
        )}
      </div>

      {isFiltering && resultCount !== undefined && totalCount !== undefined && (
        <span className={styles.meta}>
          {resultCount === 0
            ? 'Nenhum resultado'
            : `${resultCount} de ${totalCount}`}
        </span>
      )}
    </div>
  )
}

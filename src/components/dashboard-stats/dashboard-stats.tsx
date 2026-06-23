import styles from './dashboard-stats.module.css'

interface StatCardProps {
  label: string
  value: string
  trend: string
  positive?: boolean
}

function StatCard({ label, value, trend, positive = true }: StatCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      <span className={`${styles.trend} ${positive ? styles.positive : styles.negative}`}>
        {positive ? '↑' : '↓'} {trend}
      </span>
    </div>
  )
}

const STATS: StatCardProps[] = [
  { label: 'Usuários Online',  value: '—',    trend: '—'    },
  { label: 'Receita do Mês',  value: '—',    trend: '—'    },
  { label: 'Novos Cadastros', value: '—',    trend: '—'    },
  { label: 'Taxa de Erro',    value: '—',    trend: '—', positive: false },
]

export function DashboardStats() {
  return (
    <section className={styles.grid} aria-label="Resumo de métricas">
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  )
}

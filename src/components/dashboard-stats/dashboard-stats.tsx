import { useLiveFeedStore } from '../../store'
import styles from './dashboard-stats.module.css'

interface StatCardProps {
  label: string
  value: string
  sub: string
  positive?: boolean
}

function StatCard({ label, value, sub, positive = true }: StatCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      <span className={`${styles.sub} ${positive ? styles.positive : styles.negative}`}>
        {sub}
      </span>
    </div>
  )
}

export function DashboardStats() {
  const totalPresent  = useLiveFeedStore((s) => s.totalPresent)
  const totalVip      = useLiveFeedStore((s) => s.totalVip)
  const occupancyRate = useLiveFeedStore((s) => s.occupancyRate)

  const stats: StatCardProps[] = [
    {
      label: 'Total Presentes',
      value: totalPresent.toString(),
      sub: totalPresent > 0 ? '● ao vivo' : '— aguardando',
      positive: true,
    },
    {
      label: 'Taxa de Ocupação',
      value: `${occupancyRate.toFixed(1)}%`,
      sub: 'capacidade: 500',
      positive: occupancyRate < 80,
    },
    {
      label: 'Total VIP',
      value: totalVip.toString(),
      sub: totalPresent > 0 ? `${((totalVip / totalPresent) * 100).toFixed(0)}% do total` : '—',
      positive: true,
    },
    {
      label: 'Não VIP',
      value: (totalPresent - totalVip).toString(),
      sub: totalPresent > 0 ? `${(((totalPresent - totalVip) / totalPresent) * 100).toFixed(0)}% do total` : '—',
      positive: true,
    },
  ]

  return (
    <section className={styles.grid} aria-label="Resumo de métricas">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  )
}

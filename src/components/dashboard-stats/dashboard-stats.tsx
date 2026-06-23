import { useEffect, useRef, useState } from 'react'
import { useLiveFeedStore } from '../../store'
import styles from './dashboard-stats.module.css'

const CAPACITY = 500

interface StatCardProps {
  icon: string
  label: string
  value: string
  sub: string
  accent?: boolean
  danger?: boolean
  progress?: number
}

function StatCard({ icon, label, value, sub, accent, danger, progress }: StatCardProps) {
  const prevValue = useRef(value)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (prevValue.current === value) return
    prevValue.current = value
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 500)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div className={`${styles.card} ${accent ? styles.cardAccent : ''} ${danger ? styles.cardDanger : ''}`}>
      <div className={styles.cardTop}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </div>

      <span className={`${styles.value} ${flash ? styles.flash : ''}`}>
        {value}
      </span>

      {progress !== undefined && (
        <div className={styles.progressTrack}>
          <div
            className={`${styles.progressBar} ${danger ? styles.progressDanger : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <span className={`${styles.sub} ${danger ? styles.subDanger : styles.subMuted}`}>
        {sub}
      </span>
    </div>
  )
}

function LiveIndicator({ active }: { active: boolean }) {
  return (
    <div className={styles.liveIndicator} aria-label={active ? 'Feed ativo' : 'Aguardando'}>
      <span className={`${styles.liveDot} ${active ? styles.liveDotActive : ''}`} />
      <span className={styles.liveText}>{active ? 'AO VIVO' : 'AGUARDANDO'}</span>
    </div>
  )
}

export function DashboardStats() {
  const totalPresent  = useLiveFeedStore((s) => s.totalPresent)
  const totalVip      = useLiveFeedStore((s) => s.totalVip)
  const occupancyRate = useLiveFeedStore((s) => s.occupancyRate)

  const totalStd    = totalPresent - totalVip
  const vipPct      = totalPresent > 0 ? (totalVip  / totalPresent) * 100 : 0
  const isNearFull  = occupancyRate >= 80

  return (
    <section aria-label="Resumo de métricas">
      <div className={styles.header}>
        <h2 className={styles.heading}>Visão Geral</h2>
        <LiveIndicator active={totalPresent > 0} />
      </div>

      <div className={styles.grid}>
        <StatCard
          icon="👥"
          label="Total Presentes"
          value={totalPresent.toLocaleString('pt-BR')}
          sub={`de ${CAPACITY.toLocaleString('pt-BR')} de capacidade`}
        />
        <StatCard
          icon="📊"
          label="Taxa de Ocupação"
          value={`${occupancyRate.toFixed(1)}%`}
          sub={isNearFull ? 'Lotação crítica' : 'Dentro do limite'}
          danger={isNearFull}
          progress={occupancyRate}
        />
        <StatCard
          icon="⭐"
          label="Total VIP"
          value={totalVip.toLocaleString('pt-BR')}
          sub={totalPresent > 0 ? `${vipPct.toFixed(0)}% dos presentes` : '—'}
          accent
        />
        <StatCard
          icon="🎟️"
          label="Padrão"
          value={totalStd.toLocaleString('pt-BR')}
          sub={totalPresent > 0 ? `${(100 - vipPct).toFixed(0)}% dos presentes` : '—'}
        />
      </div>
    </section>
  )
}

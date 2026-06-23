import { AppHeader } from '../../components/app-header'
import { DashboardStats } from '../../components/dashboard-stats'
import { DataTable } from '../../components/data-table'
import { useLiveFeed } from '../../hooks'
import styles from './dashboard-page.module.css'

export function DashboardPage() {
  useLiveFeed()

  return (
    <>
      <AppHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <DashboardStats />
          <DataTable onOpenModal={() => {}} />
        </div>
      </main>
    </>
  )
}

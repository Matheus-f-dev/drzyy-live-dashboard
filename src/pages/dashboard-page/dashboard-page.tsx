import { useState } from 'react'
import { AppHeader } from '../../components/app-header'
import { DashboardStats } from '../../components/dashboard-stats'
import { DataTable } from '../../components/data-table'
import { AppModal } from '../../components/app-modal'
import styles from './dashboard-page.module.css'

export function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <AppHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <DashboardStats />
          <DataTable onOpenModal={() => setModalOpen(true)} />
        </div>
      </main>

      <AppModal
        isOpen={modalOpen}
        title="Novo Registro"
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}

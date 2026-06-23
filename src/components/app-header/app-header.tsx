import styles from './app-header.module.css'

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>◈</span>
        <span className={styles.title}>LiveDash</span>
      </div>

      <nav className={styles.nav}>
        <a className={styles.navLink} aria-current="page">Dashboard</a>
        <a className={styles.navLink}>Relatórios</a>
        <a className={styles.navLink}>Configurações</a>
      </nav>

      <div className={styles.actions}>
        <button className={styles.avatarBtn} aria-label="Perfil do usuário">
          <span className={styles.avatar}>JD</span>
        </button>
      </div>
    </header>
  )
}

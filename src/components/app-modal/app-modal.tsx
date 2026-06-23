import { useEffect, useRef } from 'react'
import styles from './app-modal.module.css'

interface AppModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children?: React.ReactNode
}

export function AppModal({ isOpen, title, onClose, children }: AppModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen) dialog.showModal()
    else dialog.close()
  }, [isOpen])

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">✕</button>
      </div>

      <div className={styles.body}>
        {children ?? (
          <p className={styles.placeholder}>Conteúdo do modal aqui.</p>
        )}
      </div>

      <div className={styles.footer}>
        <button className={styles.btnSecondary} onClick={onClose}>Cancelar</button>
        <button className={styles.btnPrimary}>Confirmar</button>
      </div>
    </dialog>
  )
}

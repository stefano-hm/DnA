import { useState } from 'react'
import styles from './AboutAccordion.module.css'

type Props = {
  title?: string
  children: React.ReactNode
}

export function AboutAccordion({
  title = 'About this collection',
  children,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <section className={styles.wrap}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.chevron}>{open ? '−' : '+'}</span>
      </button>

      <div className={`${styles.content} ${open ? styles.open : ''}`}>
        <div className={styles.inner}>{children}</div>
      </div>
    </section>
  )
}

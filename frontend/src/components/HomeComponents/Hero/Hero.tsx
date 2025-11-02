import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>DnA</h1>
        <p className={styles.subtitle}>
          A scientific platform exploring human well-being through
          evidence-based research and decentralized technologies.
        </p>
      </div>
    </section>
  )
}

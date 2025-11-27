import { Link } from 'react-router-dom'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>DnA</h1>

        <p className={styles.heroSubtitle}>
          A scientific platform exploring human well-being through
          evidence-based research and decentralized technologies.
        </p>

        <Link to="/store" className={styles.heroButton}>
          Go to Store
        </Link>
      </div>
    </section>
  )
}

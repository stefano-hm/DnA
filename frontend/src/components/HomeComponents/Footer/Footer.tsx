import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h3>DnA</h3>
          <p className={styles.tagline}>
            Evidence-based knowledge. Decentralized access.
          </p>
        </div>

        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            Home
          </Link>
          <Link to="/articles" className={styles.link}>
            Articles
          </Link>
          <Link to="/store" className={styles.link}>
            Store
          </Link>
          <Link to="/about" className={styles.link}>
            About
          </Link>
        </nav>

        <div className={styles.copy}>
          <p>© {new Date().getFullYear()} DnA — All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

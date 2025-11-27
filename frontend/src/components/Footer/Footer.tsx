import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footerSection}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLogo}>
          <h3 className={styles.logoTitle}>DnA</h3>
          <p className={styles.footerTagline}>
            Evidence-based knowledge. Decentralized access.
          </p>
        </div>

        <nav className={styles.footerNav}>
          <Link to="/" className={styles.footerLink}>
            Home
          </Link>
          <Link to="/articles" className={styles.footerLink}>
            Articles
          </Link>
          <Link to="/store" className={styles.footerLink}>
            Store
          </Link>
          <Link to="/auction-house" className={styles.footerLink}>
            Auction House
          </Link>
          <Link to="/about" className={styles.footerLink}>
            About
          </Link>
        </nav>

        <div className={styles.footerCopy}>
          <p>© {new Date().getFullYear()} DnA — All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

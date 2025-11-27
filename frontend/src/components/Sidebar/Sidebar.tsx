import { Link } from 'react-router-dom'
import styles from './Sidebar.module.css'

interface Props {
  open: boolean
}

export function Sidebar({ open }: Props) {
  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navItem}>
          Home
        </Link>
        <Link to="/articles" className={styles.navItem}>
          Articles
        </Link>
        <Link to="/store" className={styles.navItem}>
          Store
        </Link>
        <Link to="/auction-house" className={styles.navItem}>
          Auction House
        </Link>
        <Link to="/my-nfts" className={styles.navItem}>
          My NFTs
        </Link>
        <Link to="/about" className={styles.navItem}>
          About
        </Link>
      </nav>
    </aside>
  )
}

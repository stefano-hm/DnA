import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'
import { CustomConnectButton } from '../CustomConnectButton/CustomConnectButton'

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <Link to="/">Home</Link>
        <Link to="/articles">Articles</Link>
        <Link to="/store">Store</Link>
        <Link to="/my-nfts">My NFTs</Link>
        <Link to="/about">About</Link>
      </div>
      <CustomConnectButton />
    </nav>
  )
}

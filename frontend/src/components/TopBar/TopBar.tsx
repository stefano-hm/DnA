import { CustomConnectButton } from '../CustomConnectButton/CustomConnectButton'
import styles from './TopBar.module.css'

interface Props {
  sidebarOpen: boolean
  setSidebarOpen: (val: boolean) => void
}

export function TopBar({ sidebarOpen, setSidebarOpen }: Props) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          className={styles.hamburger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <img className={styles.logo} src="/logo.png" alt="DNA Logo" />
      </div>

      <div className={styles.connectWrapper}>
        <CustomConnectButton />
      </div>
    </header>
  )
}

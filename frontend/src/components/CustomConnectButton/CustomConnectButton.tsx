import { ConnectButton } from '@rainbow-me/rainbowkit'
import styles from './CustomConnectButton.module.css'

export function CustomConnectButton() {
  return (
    <div className={styles.wrapper}>
      <ConnectButton />
    </div>
  )
}

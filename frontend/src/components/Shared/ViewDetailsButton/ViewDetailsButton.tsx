import { Link } from 'react-router-dom'
import styles from './ViewDetailsButton.module.css'

export function ViewDetailsButton({ tokenId }: { tokenId: number }) {
  return (
    <Link to={`/nft/${tokenId}`} className={styles.detailsButton}>
      View Details
    </Link>
  )
}

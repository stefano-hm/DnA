import type { NFTItem } from '../../../types/nft'
import styles from './MyNFTCard.module.css'

interface Props {
  nft: NFTItem
}

export function MyNFTCard({ nft }: Props) {
  return (
    <div className={styles.card}>
      {nft.image && (
        <img src={nft.image} alt={nft.name} className={styles.image} />
      )}
      <div className={styles.info}>
        <h3 className={styles.name}>{nft.name}</h3>
        {nft.description && <p className={styles.desc}>{nft.description}</p>}
      </div>
    </div>
  )
}

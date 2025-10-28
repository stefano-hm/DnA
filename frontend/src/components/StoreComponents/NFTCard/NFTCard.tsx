import { useAccount } from 'wagmi'
import { BuyButton } from '../BuyButton/BuyButton'
import type { NFTCardProps } from '../../../types/nft'
import styles from './NFTCard.module.css'

export function NFTCard({
  tokenId,
  image,
  name,
  description,
  price,
  owner,
  refetch,
}: NFTCardProps) {
  const { address: userAddress } = useAccount()
  const isOwner = userAddress?.toLowerCase() === owner.toLowerCase()

  return (
    <div className={styles.card}>
      <img
        src={image}
        alt={name || `NFT ${tokenId}`}
        className={styles.image}
      />
      <h3 className={styles.cardTitle}>{name || `Token #${tokenId}`}</h3>
      {description && <p className={styles.description}>{description}</p>}
      <p className={styles.price}>{price} ETH</p>
      <p className={styles.owner}>
        Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
      </p>

      {!isOwner && (
        <BuyButton tokenId={tokenId} price={price} refetch={refetch} />
      )}
    </div>
  )
}

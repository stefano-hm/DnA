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
  const isSold =
    owner.toLowerCase() !== '0x0000000000000000000000000000000000000000' &&
    !isOwner

  return (
    <div className={`${styles.cardContainer} ${isSold ? styles.soldCard : ''}`}>
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={name || `NFT ${tokenId}`}
          className={styles.nftImage}
        />

        {isSold && <span className={styles.soldBadge}>SOLD</span>}
        {isOwner && <span className={styles.ownedBadge}>OWNED</span>}
      </div>

      <h3 className={styles.cardTitle}>{name || `Token #${tokenId}`}</h3>

      {description && <p className={styles.cardDescription}>{description}</p>}

      {!isSold && !isOwner && <p className={styles.priceTag}>{price} ETH</p>}

      <p className={styles.ownerText}>
        Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
      </p>

      {!isOwner &&
        (isSold ? (
          <button className={styles.disabledButton} disabled>
            Sold Out
          </button>
        ) : (
          price && (
            <BuyButton tokenId={tokenId} price={price} refetch={refetch} />
          )
        ))}

      {isOwner && <p className={styles.ownerTag}>You own this NFT</p>}
    </div>
  )
}

import { useAccount } from 'wagmi'
import { BuyButton } from '../BuyButton/BuyButton'
import { ViewDetailsButton } from '../../Shared/ViewDetailsButton/ViewDetailsButton'
import type { NFTCardProps } from '../../../types/nft'
import styles from './NFTCard.module.css'

const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS

export function NFTCard({
  tokenId,
  image,
  name,
  price,
  owner,
  refetch,
}: NFTCardProps) {
  const { address: userAddress } = useAccount()

  const normalizedOwner = owner.toLowerCase()
  const normalizedUser = userAddress?.toLowerCase()
  const normalizedAdmin = ADMIN_ADDRESS?.toLowerCase()

  const isOwner = normalizedUser === normalizedOwner
  const isOwnedByStore =
    normalizedAdmin !== undefined && normalizedOwner === normalizedAdmin

  const isForSale = isOwnedByStore && Number(price) > 0
  const isSold = !isForSale && !isOwner

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

      <p className={styles.ownerText}>
        Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
      </p>

      {isForSale && !isOwner && (
        <p className={styles.priceTag}>Price: {price} ETH</p>
      )}

      <ViewDetailsButton tokenId={tokenId} />

      {!isOwner &&
        (isForSale ? (
          <BuyButton tokenId={tokenId} price={price ?? '0'} refetch={refetch} />
        ) : (
          <button className={styles.disabledButton} disabled>
            Sold Out
          </button>
        ))}

      {isOwner && <p className={styles.ownerTag}>You own this NFT</p>}
    </div>
  )
}

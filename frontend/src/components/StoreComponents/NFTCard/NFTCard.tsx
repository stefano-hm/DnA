import { useAccount } from 'wagmi'
import { useState } from 'react'
import { BuyButton } from '../BuyButton/BuyButton'
import { ViewDetailsButton } from '../../Shared/ViewDetailsButton/ViewDetailsButton'
import { useSetTokenPrice } from '../../../hooks/useSetTokenPrice'
import type { NFTCardProps } from '../../../types/nft'
import styles from './NFTCard.module.css'

export function NFTCard({
  tokenId,
  image,
  name,
  price,
  priceWei,
  owner,
  refetch,
}: NFTCardProps) {
  const { address: userAddress } = useAccount()
  const [newPrice, setNewPrice] = useState('')

  const { setTokenPrice, unlist } = useSetTokenPrice(refetch)

  const normalizedOwner = owner.toLowerCase()
  const normalizedUser = userAddress?.toLowerCase()

  const isOwner = normalizedUser === normalizedOwner
  const isForSale = priceWei > 0n
  const isUnavailable = !isForSale && !isOwner

  const handleSetPrice = async () => {
    const value = newPrice.trim()
    if (!value) return
    await setTokenPrice(tokenId, value)
    setNewPrice('')
  }

  const handleUnlist = async () => {
    await unlist(tokenId)
  }

  return (
    <div
      className={`${styles.cardContainer} ${isUnavailable ? styles.soldCard : ''}`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={name || `NFT ${tokenId}`}
          className={styles.nftImage}
        />

        {isUnavailable && (
          <span className={styles.soldBadge}>NOT FOR SALE</span>
        )}
        {isOwner && <span className={styles.ownedBadge}>OWNED</span>}
      </div>

      <h3 className={styles.cardTitle}>{name || `Token #${tokenId}`}</h3>

      <p className={styles.ownerText}>
        Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
      </p>

      {isForSale && <p className={styles.priceTag}>Price: {price} ETH</p>}

      <ViewDetailsButton tokenId={tokenId} />

      {isOwner ? (
        <div className={styles.ownerActions}>
          <input
            type="text"
            value={newPrice}
            onChange={e => setNewPrice(e.target.value)}
            placeholder="Set price in ETH"
            className={styles.priceInput}
          />

          <button
            onClick={handleSetPrice}
            className={styles.setPriceButton}
            disabled={!newPrice.trim()}
          >
            Set Price
          </button>

          {isForSale && (
            <button onClick={handleUnlist} className={styles.unlistButton}>
              Remove Sale
            </button>
          )}

          <p className={styles.ownerTag}>You own this NFT</p>
        </div>
      ) : isForSale ? (
        <BuyButton tokenId={tokenId} priceWei={priceWei} refetch={refetch} />
      ) : (
        <button className={styles.disabledButton} disabled>
          Not for sale
        </button>
      )}
    </div>
  )
}

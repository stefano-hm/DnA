import { useParams, Link } from 'react-router-dom'
import { useNFTs } from '../../hooks/useNFTs'
import { useAccount } from 'wagmi'
import { BuyButton } from '../../components/StoreComponents/BuyButton/BuyButton'
import { useAuctionData } from '../../hooks/useAuctionData'
import styles from './NFTDetail.module.css'

const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS

export default function NFTDetail() {
  const { id } = useParams()
  const tokenId = Number(id)

  const { nfts, isLoading, error, refetch } = useNFTs()
  const { address: userAddress } = useAccount()
  const { loading: auctionsLoading, activeAuctions } = useAuctionData()

  if (isLoading || auctionsLoading) {
    return <p className={styles.statusText}>Loading NFT…</p>
  }

  if (error) {
    return <p className={styles.errorText}>Error loading NFT.</p>
  }

  const nft = nfts.find(n => n.tokenId === tokenId)
  if (!nft) {
    return <p className={styles.notFoundText}>NFT not found.</p>
  }

  const { image, name, description, owner, price } = nft

  const normalizedOwner = owner.toLowerCase()
  const normalizedUser = userAddress?.toLowerCase()
  const normalizedAdmin = ADMIN_ADDRESS?.toLowerCase()

  const isOwner = normalizedUser === normalizedOwner
  const isOwnedByStore = normalizedAdmin && normalizedOwner === normalizedAdmin
  const isForSale = isOwnedByStore && Number(price) > 0

  const isInAuction =
    Array.isArray(activeAuctions) &&
    activeAuctions.some(a => a.tokenId === tokenId)

  const isSold = !isForSale && !isOwner && !isInAuction

  return (
    <div className={styles.detailPage}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <img src={image} alt={name} className={styles.image} />
          {isSold && <span className={styles.soldBadge}>SOLD</span>}
          {isOwner && <span className={styles.ownedBadge}>OWNED</span>}
        </div>

        <h2 className={styles.title}>{name || `Token #${tokenId}`}</h2>

        <p className={styles.infoLabel}>
          <strong>Token ID:</strong> {tokenId}
        </p>

        <div className={styles.infoBox}>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        <div className={styles.buttonsWrapper}>
          {!isOwner &&
            (isInAuction ? (
              <Link to="/auction-house" className={styles.stateTag}>
                This NFT is currently in auction →
              </Link>
            ) : isForSale ? (
              <BuyButton
                tokenId={tokenId}
                price={price ?? '0'}
                refetch={refetch}
              />
            ) : (
              <p className={styles.stateTag}>Sold Out</p>
            ))}

          {isOwner && <p className={styles.ownerTag}>You own this NFT</p>}
        </div>
      </div>
    </div>
  )
}

import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useNFTs } from '../../hooks/useNFTs'
import { useAccount } from 'wagmi'
import { BuyButton } from '../../components/StoreComponents/BuyButton/BuyButton'
import { useAuctionData } from '../../hooks/useAuctionData'
import styles from './NFTDetail.module.css'

const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export default function NFTDetail() {
  const { id } = useParams()
  const tokenId = Number(id)

  const { nfts, isLoading, error, refetch } = useNFTs()
  const { address: userAddress } = useAccount()
  const { loading: auctionsLoading, activeAuctions } = useAuctionData()

  const loading = isLoading || auctionsLoading

  const nft = useMemo(
    () => nfts.find(n => n.tokenId === tokenId),
    [nfts, tokenId]
  )

  if (loading) return <p className={styles.statusText}>Loading NFT…</p>
  if (error) return <p className={styles.errorText}>Error loading NFT.</p>
  if (!nft) return <p className={styles.notFoundText}>NFT not found.</p>

  const { image, name, description, owner, price, priceWei } = nft

  const normalizedOwner = owner.toLowerCase()
  const normalizedUser = userAddress?.toLowerCase()
  const normalizedAdmin = ADMIN_ADDRESS?.toLowerCase()

  const isOwner = !!normalizedUser && normalizedUser === normalizedOwner
  const isOwnedByStore =
    !!normalizedAdmin && normalizedOwner === normalizedAdmin

  const isForSale = priceWei > 0n

  const isInAuction =
    Array.isArray(activeAuctions) &&
    activeAuctions.some(a => a.tokenId === tokenId)

  const status = isInAuction
    ? 'In auction'
    : isOwner
      ? 'Owned'
      : isForSale
        ? 'For sale'
        : 'Not for sale'

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link to="/store" className={styles.backLink}>
            ← Back to Store
          </Link>
        </div>

        <div className={styles.grid}>
          <div className={styles.mediaCard}>
            <div className={styles.imageWrap}>
              <img
                src={image}
                alt={name || `Token #${tokenId}`}
                className={styles.image}
              />
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.headerRow}>
              <div>
                <h1 className={styles.title}>{name || `Token #${tokenId}`}</h1>
                <p className={styles.subtitle}>Token #{tokenId}</p>
              </div>

              <span
                className={`${styles.badge} ${
                  status === 'For sale'
                    ? styles.badgeSale
                    : status === 'Owned'
                      ? styles.badgeOwned
                      : status === 'In auction'
                        ? styles.badgeAuction
                        : styles.badgeOff
                }`}
              >
                {status}
              </span>
            </div>

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <p className={styles.metaLabel}>Owner</p>
                <p className={styles.metaValue}>{shortAddr(owner)}</p>
              </div>

              <div className={styles.metaItem}>
                <p className={styles.metaLabel}>Price</p>
                <p className={styles.metaValue}>
                  {isForSale ? `${price} ETH` : '—'}
                </p>
              </div>
            </div>

            {description ? (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <p className={styles.description}>{description}</p>
              </div>
            ) : (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <p className={styles.descriptionMuted}>
                  No description provided for this NFT.
                </p>
              </div>
            )}

            <div className={styles.actions}>
              {!isOwner &&
                (isInAuction ? (
                  <Link to="/auction-house" className={styles.secondaryButton}>
                    View auction
                  </Link>
                ) : isForSale ? (
                  <BuyButton
                    tokenId={tokenId}
                    priceWei={priceWei}
                    refetch={() => refetch()}
                  />
                ) : (
                  <button className={styles.disabledButton} disabled>
                    Not for sale
                  </button>
                ))}

              {isOwner && (
                <div className={styles.ownerNotice}>
                  You own this NFT.
                  {isOwnedByStore ? ' (Store wallet)' : ''}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.bottomSpacer} />
      </div>
    </div>
  )
}

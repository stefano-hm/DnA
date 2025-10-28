import { useAccount } from 'wagmi'
import { useBuyNFT } from '../../../hooks/useBuyNFT'
import styles from './NFTCard.module.css'

type NFTCardProps = {
  tokenId: number
  image: string
  name: string
  description: string
  price: string
  owner: string
}

export function NFTCard({
  tokenId,
  image,
  name,
  description,
  price,
  owner,
}: NFTCardProps) {
  const { address: userAddress } = useAccount()
  const { buyNFT } = useBuyNFT()
  const isOwner = userAddress?.toLowerCase() === owner.toLowerCase()

  const handleBuy = async () => {
    if (!userAddress) {
      alert('Connect your wallet first')
      return
    }
    await buyNFT(tokenId, price)
  }

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
        <button onClick={handleBuy} className={styles.buyButton}>
          Buy Now
        </button>
      )}
    </div>
  )
}

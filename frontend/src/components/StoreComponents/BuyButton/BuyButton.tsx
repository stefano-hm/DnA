import { useAccount } from 'wagmi'
import { useBuyNFT } from '../../../hooks/useBuyNFT'
import type { BuyButtonProps } from '../../../types/nft'
import styles from './BuyButton.module.css'

export function BuyButton({ tokenId, price, refetch }: BuyButtonProps) {
  const { address: userAddress } = useAccount()
  const { buyNFT } = useBuyNFT(refetch)

  const handleBuy = async () => {
    if (!userAddress) {
      alert('Connect your wallet first')
      return
    }
    await buyNFT(tokenId, price)
  }

  return (
    <button onClick={handleBuy} className={styles.buyButton}>
      Buy Now
    </button>
  )
}

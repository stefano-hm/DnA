import { useAccount } from 'wagmi'
import { useOwnedNFTs } from '../../hooks/useOwnedNFTs'
import { MyNFTCard } from '../../components/MyNFTsComponents/MyNFTCard/MyNFTCard'
import styles from './MyNFTs.module.css'

export default function MyNFTs() {
  const { address } = useAccount()
  const { nfts, isLoading } = useOwnedNFTs(address)

  if (!address)
    return (
      <p className={styles.myNftsMessage}>
        Connect your wallet to see your NFTs
      </p>
    )

  if (isLoading) return <p className={styles.myNftsMessage}>Loading...</p>

  return (
    <div className={styles.myNftsPage}>
      <h1 className={styles.myNftsTitle}>My NFTs</h1>

      {nfts.length === 0 ? (
        <p className={styles.myNftsMessage}>No NFTs found.</p>
      ) : (
        <div className={styles.myNftsGrid}>
          {nfts.map(nft => (
            <MyNFTCard key={nft.tokenId} nft={nft} />
          ))}
        </div>
      )}
    </div>
  )
}

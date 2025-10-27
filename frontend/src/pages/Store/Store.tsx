import { MintButton } from '../../components/StoreComponents/MintButton/MintButton'
import { NFTCard } from '../../components/StoreComponents/NFTCard/NFTCard'
import { useNFTs } from '../../hooks/useNFTs'
import styles from './Store.module.css'

export default function Store() {
  const { nfts, isLoading, error } = useNFTs()

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>DnA NFT Store</h2>

      <div className={styles.mintSection}>
        <MintButton />
      </div>

      {isLoading && <p>Loading NFTs from blockchain...</p>}
      {error && <p className={styles.error}>Error loading NFTs.</p>}

      <div className={styles.grid}>
        {nfts.length === 0 && !isLoading && <p>No NFTs found.</p>}

        {nfts.map(nft => (
          <NFTCard
            key={nft.tokenId}
            tokenId={nft.tokenId}
            image={nft.image}
            price={nft.price}
            owner={nft.owner}
          />
        ))}
      </div>
    </div>
  )
}

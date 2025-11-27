import { useAccount } from 'wagmi'
import { StoreHero } from '../../components/StoreComponents/StoreHero/StoreHero'
import { StoreIntro } from '../../components/StoreComponents/StoreIntro/StoreIntro'
import { MintForm } from '../../components/StoreComponents/MintForm/MintForm'
import { NFTCard } from '../../components/StoreComponents/NFTCard/NFTCard'
import { useNFTs } from '../../hooks/useNFTs'
import styles from './Store.module.css'

const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS

export default function Store() {
  const { address: userAddress } = useAccount()
  const { nfts, isLoading, error, refetch } = useNFTs()

  const isAdmin =
    userAddress &&
    ADMIN_ADDRESS &&
    userAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase()

  return (
    <>
      <div className={styles.heroSection}>
        <div className={styles.coloredBg}></div>

        <div className={styles.heroContent}>
          <div className={styles.leftCol}>
            <StoreHero />

            <div className={styles.storeIntroWrapper}>
              <StoreIntro />
            </div>
          </div>

          <div className={styles.rightCol}>
            <img src="/store-images/store-hero.png" alt="Store Hero" />
          </div>
        </div>
      </div>

      <div className={styles.storePage}>
        {isAdmin && (
          <div className={styles.mintWrapper}>
            <MintForm onMintSuccess={() => refetch()} />
          </div>
        )}

        {isLoading && <p className={styles.statusText}>Loading NFTs…</p>}
        {error && <p className={styles.errorText}>Error loading NFTs.</p>}

        <div className={styles.nftGrid}>
          {nfts.map(nft => (
            <NFTCard key={nft.tokenId} {...nft} refetch={refetch} />
          ))}
        </div>
      </div>
    </>
  )
}

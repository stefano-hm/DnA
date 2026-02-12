import { useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { StoreIntro } from '../../components/StoreComponents/StoreIntro/StoreIntro'
import { MintForm } from '../../components/StoreComponents/MintForm/MintForm'
import { NFTCard } from '../../components/StoreComponents/NFTCard/NFTCard'
import {
  StoreToolbar,
  type StoreFilter,
  type StoreSort,
} from '../../components/StoreComponents/StoreToolbar/StoreToolbar'
import { AboutAccordion } from '../../components/StoreComponents/AboutAccordion/AboutAccordion'
import { useNFTs } from '../../hooks/useNFTs'
import styles from './Store.module.css'

const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS

export default function Store() {
  const { address: userAddress } = useAccount()
  const { nfts, isLoading, error, refetch } = useNFTs()

  const [filter, setFilter] = useState<StoreFilter>('all')
  const [sort, setSort] = useState<StoreSort>('newest')

  const isAdmin =
    userAddress &&
    ADMIN_ADDRESS &&
    userAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase()

  const filteredSorted = useMemo(() => {
    let list = [...nfts]

    if (filter === 'forSale') {
      list = list.filter(
        n =>
          n.priceWei > 0n &&
          n.owner.toLowerCase() !== (userAddress?.toLowerCase() ?? '')
      )
    }

    if (filter === 'owned') {
      const u = userAddress?.toLowerCase()
      list = list.filter(n => !!u && n.owner.toLowerCase() === u)
    }

    if (sort === 'newest') {
      list.sort((a, b) => b.tokenId - a.tokenId)
    } else if (sort === 'priceLow') {
      list.sort((a, b) => Number(a.priceWei - b.priceWei))
    } else if (sort === 'priceHigh') {
      list.sort((a, b) => Number(b.priceWei - a.priceWei))
    }

    return list
  }, [nfts, filter, sort, userAddress])

  return (
    <>
      <div className={styles.storePage}>
        <StoreToolbar
          total={nfts.length}
          visibleCount={filteredSorted.length}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
        />

        {isAdmin && (
          <div className={styles.mintWrapper}>
            <MintForm onMintSuccess={() => refetch()} />
          </div>
        )}

        {isLoading && <p className={styles.statusText}>Loading NFTs…</p>}
        {error && <p className={styles.errorText}>Error loading NFTs.</p>}

        {!isLoading && !error && filteredSorted.length === 0 && (
          <p className={styles.statusText}>No NFTs match your filters.</p>
        )}

        <div className={styles.nftGrid}>
          {filteredSorted.map(nft => (
            <NFTCard key={nft.tokenId} {...nft} refetch={refetch} />
          ))}
        </div>

        <AboutAccordion title="About this collection">
          <StoreIntro />
        </AboutAccordion>
      </div>
    </>
  )
}

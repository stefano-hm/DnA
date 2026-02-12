import styles from './StoreToolbar.module.css'

export type StoreFilter = 'all' | 'forSale' | 'owned'
export type StoreSort = 'newest' | 'priceLow' | 'priceHigh'

type Props = {
  total: number
  visibleCount: number
  filter: StoreFilter
  setFilter: (v: StoreFilter) => void
  sort: StoreSort
  setSort: (v: StoreSort) => void
}

export function StoreToolbar({
  total,
  visibleCount,
  filter,
  setFilter,
  sort,
  setSort,
}: Props) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <h2 className={styles.title}>DnA Editorials</h2>
        <p className={styles.subtitle}>
          {visibleCount} of {total} items
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.chips} role="tablist" aria-label="Filters">
          <button
            type="button"
            className={`${styles.chip} ${filter === 'all' ? styles.chipActive : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`${styles.chip} ${filter === 'forSale' ? styles.chipActive : ''}`}
            onClick={() => setFilter('forSale')}
          >
            For sale
          </button>
          <button
            type="button"
            className={`${styles.chip} ${filter === 'owned' ? styles.chipActive : ''}`}
            onClick={() => setFilter('owned')}
          >
            Owned
          </button>
        </div>

        <div className={styles.sort}>
          <label className={styles.sortLabel}>
            Sort
            <select
              className={styles.select}
              value={sort}
              onChange={e => setSort(e.target.value as StoreSort)}
            >
              <option value="newest">Newest</option>
              <option value="priceLow">Price: low to high</option>
              <option value="priceHigh">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}

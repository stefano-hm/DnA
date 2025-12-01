import styles from './StoreIntro.module.css'

export function StoreIntro() {
  return (
    <section className={styles.intro}>
      <h1 className={styles.title}>Scientific Digital Assets</h1>
      <div className={styles.subtitle}>
        <p>
          Every token in the DnA collection embodies a scientifically-grounded
          idea, exploring neuroscience, behavior and digital autonomy.
        </p>
        <br />
        <p>
          Each asset is secured on-chain, ensuring permanence, transparency and
          true user ownership.
        </p>
      </div>
    </section>
  )
}

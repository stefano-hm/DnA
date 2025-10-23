import styles from './Loader.module.css'

export function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Loading...</p>
    </div>
  )
}


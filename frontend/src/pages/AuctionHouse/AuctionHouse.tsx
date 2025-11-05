import { AuctionHeader } from '../../components/AuctionHouseComponents/AuctionHeader/AuctionHeader'
import { AuctionList } from '../../components/AuctionHouseComponents/AuctionList/AuctionList'
import { AdminAuctionForm } from '../../components/AuctionHouseComponents/AdminAuctionForm/AdminAuctionForm'
import styles from './AuctionHouse.module.css'

export default function AuctionPage() {
  return (
    <div className={styles.page}>
      <AuctionHeader />
      <AdminAuctionForm />
      <AuctionList />
    </div>
  )
}

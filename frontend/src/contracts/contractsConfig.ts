import DnANFT from './DnANFT.json'
import DnAAuctionHouse from './DnAAuctionHouse.json'

export const contractsConfig = {
  DnANFT: {
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: DnANFT.abi,
  },
  DnAAuctionHouse: {
    address: '0x63e56e871Aff3f479df9C8C82ECe12C7a6D73297',
    abi: DnAAuctionHouse.abi,
  },
} as const

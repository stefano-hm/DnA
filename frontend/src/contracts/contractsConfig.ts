import DnANFT from './DnANFT.json'
import DnAAuctionHouse from './DnAAuctionHouse.json'

export const contractsConfig = {
  DnANFT: {
    address: '0x4c86323823af6302D7C4939a80fbD3736305575c',
    abi: DnANFT.abi,
  },
  DnAAuctionHouse: {
    address: '0x63e56e871Aff3f479df9C8C82ECe12C7a6D73297',
    abi: DnAAuctionHouse.abi,
  },
} as const

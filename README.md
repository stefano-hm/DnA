# DnA 

A Web3-powered platform for publishing, selling, and unlocking neuroscience articles through NFT ownership.

## Overview

**DnA** is a decentralized application (dApp) that blends scientific publishing with blockchain technology.
The platform hosts neuroscience-focused articles divided into five categories. Some articles are **NFT-gated**, meaning they can only be accessed by owning a specific NFT associated with the article.

DnA includes:

- An on-chain NFT collection
- An on-chain Auction House
- A full Web3-enabled frontend (React, Wagmi, RainbowKit)
- IPFS/Pinata integration for decentralized storage
- Real ownership checks to unlock protected content

The goal is to create a transparent, verifiable and decentralized environment for distributing digital scientific content.

## Features

### Articles System

- Articles written in Markdown with front-matter metadata
- Five main categories
- Sorting, filtering and category navigation
- Featured articles on the homepage
- **NFT-gated access** for premium content

### NFT System

Each NFT has:

- Supply = 1 (each token is unique)
- Name, description, image, attributes
- Metadata stored on **IPFS (Pinata)**
- Image stored on **IPFS (Pinata)**
- URI returned via metadata JSON
- Price set by the admin

Users can:

- View all NFTs
- Buy NFTs directly from the Store
- Open the NFT Detail page for metadata, description, owner, price, etc.
- Add NFTs to MetaMask

Admins can:

- Mint new NFTs
- Upload images + metadata to IPFS
- Set token prices
- Add new NFT details via forms
- Only available to the admin wallet

### Auction House

Admins can start auctions on minted NFTs

- Auctions include: starting bid and end time

Users can:

- place bids
- increase bids
- withdraw losing bids after the auction
- claim the NFT if they are the winner

Events automatically update the UI

### NFT-Gated Articles

Protected articles include:

```bash
nftAccess: true
nftId: <TOKEN_ID>
```

Access logic:

- The frontend calls the smart contract directly:

```bash
ownerOf(nftId)
```

- If the connected wallet is not the owner → article remains locked
- If the wallet is the owner → full content is unlocked

This ensures **true on-chain permissioning**, without local caching or faked checks.

## Tech Stack

### Frontend

- **React 19**
- **TypeScript**
- **Vite**
- **React Router 7**
- **RainbowKit** (wallet connection UI)
- **Wagmi + Viem** (Web3 client)
- **Ethers v6** (additional blockchain interactions)
- **React Markdown**, **remark-gfm**, **remark-math**
- **KaTeX + rehype-katex** for scientific formulas
- **react-hot-toast** for notifications
- **Helia / @helia/unixfs** (IPFS client)
- **Pinata API** for file + JSON uploads
- **ESLint + Prettier**

### Blockchain

- **Hardhat**
- **Solidity 0.8.24**
- **OpenZeppelin Contracts**
- **Sepolia Testnet deployment**
- Full testing suite (```contracts/test```)

## Project Structure

```bash
Dna/
│
├── blockchain/
│   ├── contracts/
│   │   ├── DnANFT.sol
│   │   └── DnAAuctionHouse.sol
│   ├── scripts/
│   │   └── deploy.ts
│   ├── test/
│   │   ├── DnANFT.test.ts
│   │   └── DnAAuctionHouse.test.ts
│   └── hardhat.config.ts
│
└── frontend/
    ├── public/                 # Images, favicon, SEO assets
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── wagmiConfig.ts
        ├── components/
        ├── contracts/          # ABIs + contract config
        ├── hooks/
        ├── pages/
        ├── services/           # IPFS, Pinata handlers
        ├── styles/
        ├── types/
        └── utils/              # loadArticles.ts
```

## Roles & Permissions

### Admin (frontend)

The admin is determined **off-chain**, via:

```bash
VITE_ADMIN_ADDRESS=<wallet>
```

If the connected wallet equals this address, admin features unlock.

Admin can:

- Mint new NFTs
- Upload images + metadata to IPFS
- Set NFT prices
- Add title + description to NFTs
- Start auctions
- Set starting bid for auctions

Admin-only UI is shown in:

- ```/Store``` → MintForm

- ```/AuctionHouse``` → AdminAuctionForm

### Admin (smart contracts)

On-chain admins are managed with:

```bash
setAdmin(address, bool)
```

However, ***only the address in** ```VITE_ADMIN_ADDRESS``` **sees admin UI**.

(Important distinction documented clearly.)

### Standard User

A normal connected wallet can:

- Buy NFTs
- View NFT metadata
- Bid in auctions
- Increase bids
- Withdraw refund after losing an auction
- Claim NFT if auction is won
- Add NFTs to MetaMask
- Access articles unlocked by owned NFTs

## Pages

### Home

- Hero section leading to the Store
- Five article categories
- Two featured articles
- CTA for the About page
- Footer

### Articles

- Full list of articles
- Category filter via pills
- Previews with title, date, category, image
- Click to open full article

### Store

- Grid of all NFTs
- Buy Now button
- View Details → opens NFT Detail page
- Admin sees the MintForm

### NFT Detail

- Image
- Name
- Description
- Price
- Owner
- “Add to MetaMask” button
- Buy functionality

### Auction House

Three sections:

- **Live Auctions**
- **Active Auctions**
- **Ended Auctions**

Admin-only auction creation form appears for admin wallet.

### My NFTs

- List of NFTs owned by the current wallet
- Based on on-chain ownership

### About

- Overview of the DnA mission and team
- Standard informational page

## Smart Contracts

### DnANFT.sol

- ERC721 with URI storage
- Admin-controlled minting
- IPFS metadata
- Token price management
- Secure marketplace-style ```buy()```

**Events**:

- ```Minted```
- ```PriceSet```
- ```Purchased```

**Utility functions**:

- ```getAllNFTs()```
- ```getOwnedNFTs(address)```

**Deployed to Sepolia at:**

```bash
0x4c86323823af6302D7C4939a80fbD3736305575c
```

### DnAAuctionHouse.sol

- On-chain auction system for NFTs
- Admin can list NFTs for auction
- Bidding system with refund tracking
- Secure claim + withdrawal
- Uses ```ReentrancyGuard```

**Events**:

- ```AuctionStarted```
- ```BidPlaced```
- ```Withdrawn```
- ```AuctionEnded```
- ```Claimed```

**Deployed to Sepolia at:**

```bash
0x63e56e871Aff3f479df9C8C82ECe12C7a6D73297
```

## Environment Variables

Here is a ready-to-use ```.env.example```:

```bash
# -----------------------
# FRONTEND VARIABLES
# -----------------------

VITE_ALCHEMY_KEY=yourAlchemyKeyHere

# Admin wallet (frontend-only admin)
VITE_ADMIN_ADDRESS=0xYourAdminWalletHere

# Pinata (IPFS)
VITE_PINATA_JWT=yourPinataJWT
VITE_PINATA_GATEWAY_DOMAIN=gateway.pinata.cloud


# -----------------------
# HARDHAT / BLOCKCHAIN
# -----------------------

SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/yourApiKey
PRIVATE_KEY=yourPrivateKeyHere
ETHERSCAN_API_KEY=yourEtherscanKeyHere
```

## Installation & Development

### Backend / Smart Contracts

```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat test

# optional: deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```npm run build```

Preview:

```npm run preview```

## IPFS & Pinata Workflow

### Upload image

```bash
const cid = await uploadImageToIPFS(file)
```

### Upload metadata JSON

```bash
const metadataCid = await uploadJSONToIPFS({...})
```

### Produce final tokenURI

```bash
ipfs://<CID>
```

Converted to HTTP for display via:

```bash
ipfsToHttp()
```

## How Article Unlocking Works

1. Article markdown contains:

```bash
nftAccess: true
nftId: 2
```

2. The frontend executes:

```bash
ownerOf(article.nftId)
```

3. Access granted if:

```bash
ownerAddress.toLowerCase() === userAddress.toLowerCase()
```

4. If not the owner → article stays locked.

This ensures **real**, **on-chain**, **verifiable ownership gating**.

## License

This project uses the MIT License.



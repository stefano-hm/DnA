import type { PinataFileResponse, PinataJSONResponse } from '../types/pinata'

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT as string
const PINATA_GATEWAY =
  (import.meta.env.VITE_PINATA_GATEWAY_DOMAIN as string) ||
  'gateway.pinata.cloud'

export function ipfsToHttp(
  ipfsUri: string,
  gatewayDomain: string = PINATA_GATEWAY
): string {
  if (!ipfsUri) return ''
  if (!ipfsUri.startsWith('ipfs://')) return ipfsUri
  const rest = ipfsUri.replace('ipfs://', '')
  return `https://${gatewayDomain}/ipfs/${rest}`
}

export function cidToGatewayUrl(
  cid: string,
  path: string = '',
  gatewayDomain: string = PINATA_GATEWAY
): string {
  const cleanPath = path ? (path.startsWith('/') ? path.slice(1) : path) : ''
  return `https://${gatewayDomain}/ipfs/${cid}${cleanPath ? `/${cleanPath}` : ''}`
}

export async function uploadImageToIPFS(file: File): Promise<string> {
  if (!PINATA_JWT) throw new Error('Pinata JWT not configured')

  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: form,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(
      `Pinata pinFileToIPFS failed: ${res.status} ${res.statusText} — ${text}`
    )
  }

  const data = (await res.json()) as PinataFileResponse
  return data.IpfsHash
}

export async function uploadJSONToIPFS(json: unknown): Promise<string> {
  if (!PINATA_JWT) throw new Error('Pinata JWT not configured')

  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pinataContent: json,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(
      `Pinata pinJSONToIPFS failed: ${res.status} ${res.statusText} — ${text}`
    )
  }

  const data = (await res.json()) as PinataJSONResponse
  return data.IpfsHash
}

export async function createAndUploadMetadata({
  name,
  description,
  imageURI,
  attributes,
}: {
  name: string
  description: string
  imageURI: string
  attributes?: Array<{ trait_type: string; value: string | number }>
}): Promise<string> {
  const metadata = {
    name,
    description,
    image: imageURI,
    ...(attributes ? { attributes } : {}),
  }

  const metadataCid = await uploadJSONToIPFS(metadata)
  return `ipfs://${metadataCid}`
}

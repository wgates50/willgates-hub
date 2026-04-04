import { kv } from "@vercel/kv"

// WebAuthn relying party config
export const rpName = "Will Gates Hub"
export const rpID = process.env.NEXT_PUBLIC_DOMAIN || "localhost"
export const origin = process.env.NEXTAUTH_URL || "http://localhost:3000"

export interface StoredCredential {
  credentialID: string
  credentialPublicKey: string // base64
  counter: number
  transports?: AuthenticatorTransport[]
  createdAt: string
}

export interface StoredChallenge {
  challenge: string
  userId?: string
  expiresAt: number
}

// KV keys
const CREDENTIALS_KEY = "passkey:credentials"
const CHALLENGE_KEY = (id: string) => `passkey:challenge:${id}`

export async function getCredentials(): Promise<StoredCredential[]> {
  try {
    const creds = await kv.get<StoredCredential[]>(CREDENTIALS_KEY)
    return creds || []
  } catch {
    return []
  }
}

export async function saveCredential(cred: StoredCredential): Promise<void> {
  const existing = await getCredentials()
  existing.push(cred)
  await kv.set(CREDENTIALS_KEY, existing)
}

export async function updateCredentialCounter(
  credentialID: string,
  newCounter: number
): Promise<void> {
  const creds = await getCredentials()
  const updated = creds.map((c) =>
    c.credentialID === credentialID ? { ...c, counter: newCounter } : c
  )
  await kv.set(CREDENTIALS_KEY, updated)
}

export async function deleteCredential(credentialID: string): Promise<void> {
  const creds = await getCredentials()
  const filtered = creds.filter((c) => c.credentialID !== credentialID)
  await kv.set(CREDENTIALS_KEY, filtered)
}

export async function saveChallenge(
  sessionId: string,
  challenge: string,
  userId?: string
): Promise<void> {
  await kv.set(
    CHALLENGE_KEY(sessionId),
    { challenge, userId, expiresAt: Date.now() + 5 * 60 * 1000 } as StoredChallenge,
    { ex: 300 } // 5 min TTL
  )
}

export async function getChallenge(
  sessionId: string
): Promise<StoredChallenge | null> {
  try {
    const stored = await kv.get<StoredChallenge>(CHALLENGE_KEY(sessionId))
    if (!stored || stored.expiresAt < Date.now()) return null
    // Delete after use
    await kv.del(CHALLENGE_KEY(sessionId))
    return stored
  } catch {
    return null
  }
}
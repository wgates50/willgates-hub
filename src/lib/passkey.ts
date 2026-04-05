// @ts-nocheck
import { Redis } from "@upstash/redis"

// Upstash Redis client — uses the same env var names as Vercel KV
// so no config change needed if you later switch back
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

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

// Redis keys
const CREDENTIALS_KEY = "passkey:credentials"
const CHALLENGE_KEY = (id: string) => `passkey:challenge:${id}`

export async function getCredentials(): Promise<StoredCredential[]> {
  try {
    const creds = await redis.get<StoredCredential[]>(CREDENTIALS_KEY)
    return creds || []
  } catch {
    return []
  }
}

export async function saveCredential(cred: StoredCredential): Promise<void> {
  const existing = await getCredentials()
  existing.push(cred)
  await redis.set(CREDENTIALS_KEY, existing)
}

export async function updateCredentialCounter(
  credentialID: string,
  newCounter: number
): Promise<void> {
  const creds = await getCredentials()
  const updated = creds.map((c) =>
    c.credentialID === credentialID ? { ...c, counter: newCounter } : c
  )
  await redis.set(CREDENTIALS_KEY, updated)
}

export async function deleteCredential(credentialID: string): Promise<void> {
  const creds = await getCredentials()
  const filtered = creds.filter((c) => c.credentialID !== credentialID)
  await redis.set(CREDENTIALS_KEY, filtered)
}

export async function saveChallenge(
  sessionId: string,
  challenge: string,
  userId?: string
): Promise<void> {
  await redis.set(
    CHALLENGE_KEY(sessionId),
    { challenge, userId, expiresAt: Date.now() + 5 * 60 * 1000 } as StoredChallenge,
    { ex: 300 } // 5 min TTL
  )
}

export async function getChallenge(
  sessionId: string
): Promise<StoredChallenge | null> {
  try {
    const stored = await redis.get<StoredChallenge>(CHALLENGE_KEY(sessionId))
    if (!stored || stored.expiresAt < Date.now()) return null
    // Delete after use
    await redis.del(CHALLENGE_KEY(sessionId))
    return stored
  } catch {
    return null
  }
}

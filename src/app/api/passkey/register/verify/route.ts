// @ts-nocheck
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { verifyRegistrationResponse } from "@simplewebauthn/server"
import {
  rpID,
  origin,
  getChallenge,
  saveCredential,
  type StoredCredential,
} from "@/lib/passkey"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { credential, sessionId } = await request.json()

  const stored = await getChallenge(sessionId)
  if (!stored) {
    return NextResponse.json({ error: "Challenge expired" }, { status: 400 })
  }

  try {
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: stored.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    })

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 })
    }

    const regInfo = verification.registrationInfo

    const newCred: StoredCredential = {
      credentialID: regInfo.credentialID,
      credentialPublicKey: Buffer.from(regInfo.credentialPublicKey).toString("base64"),
      counter: regInfo.counter,
      transports: credential.response.transports,
      createdAt: new Date().toISOString(),
    }

    await saveCredential(newCred)

    return NextResponse.json({ verified: true })
  } catch (error) {
    console.error("Registration verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 400 })
  }
}
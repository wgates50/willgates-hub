import { NextResponse } from "next/server"
import { verifyAuthenticationResponse } from "@simplewebauthn/server"
import {
  rpID,
  origin,
  getChallenge,
  getCredentials,
  updateCredentialCounter,
} from "@/lib/passkey"
import { encode } from "next-auth/jwt"

export async function POST(request: Request) {
  const { credential, sessionId } = await request.json()

  const stored = await getChallenge(sessionId)
  if (!stored) {
    return NextResponse.json({ error: "Challenge expired" }, { status: 400 })
  }

  const credentials = await getCredentials()
  const credID = Buffer.from(credential.id, "base64url").toString("base64url")
  const matchingCred = credentials.find((c) => c.credentialID === credID)

  if (!matchingCred) {
    return NextResponse.json({ error: "Unknown credential" }, { status: 400 })
  }

  try {
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: stored.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: matchingCred.credentialID,
        credentialPublicKey: new Uint8Array(Buffer.from(matchingCred.credentialPublicKey, "base64")),
        counter: matchingCred.counter,
        transports: matchingCred.transports,
      },
    })

    if (!verification.verified) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 })
    }

    await updateCredentialCounter(
      matchingCred.credentialID,
      verification.authenticationInfo.newCounter
    )

    // Create a NextAuth-compatible JWT token
    const token = await encode({
      token: {
        name: "Will Gates",
        email: "wgates50@gmail.com",
        sub: "passkey-user",
      },
      secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me-in-production",
    })

    const response = NextResponse.json({ verified: true })

    // Set the NextAuth session cookie
    const isProduction = process.env.NODE_ENV === "production"
    const cookieName = isProduction
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token"

    response.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return response
  } catch (error) {
    console.error("Authentication verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 400 })
  }
}
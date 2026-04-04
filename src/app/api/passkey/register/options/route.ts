// @ts-nocheck
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { generateRegistrationOptions } from "@simplewebauthn/server"
import {
  rpName,
  rpID,
  getCredentials,
  saveChallenge,
} from "@/lib/passkey"
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const existingCreds = await getCredentials()
  const sessionId = crypto.randomUUID()

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: session.user.email,
    userDisplayName: session.user.name || "Will",
    attestationType: "none",
    excludeCredentials: existingCreds.map((c) => ({
      id: c.credentialID,
      transports: c.transports,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
      authenticatorAttachment: "platform", // Forces Touch ID / Windows Hello
    },
  })

  await saveChallenge(sessionId, options.challenge, session.user.email)

  return NextResponse.json({ options, sessionId })
}
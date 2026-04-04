import { NextResponse } from "next/server"
import { generateAuthenticationOptions } from "@simplewebauthn/server"
import { rpID, getCredentials, saveChallenge } from "@/lib/passkey"

export async function POST() {
  const credentials = await getCredentials()
  const sessionId = crypto.randomUUID()

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: credentials.map((c) => ({
      id: c.credentialID,
      transports: c.transports,
    })),
    userVerification: "preferred",
  })

  await saveChallenge(sessionId, options.challenge)

  return NextResponse.json({ options, sessionId })
}
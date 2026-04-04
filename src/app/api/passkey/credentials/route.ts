// @ts-nocheck
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { getCredentials, deleteCredential } from "@/lib/passkey"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const creds = await getCredentials()
  // Return safe subset
  return NextResponse.json(
    creds.map((c) => ({
      id: c.credentialID,
      createdAt: c.createdAt,
      transports: c.transports,
    }))
  )
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { credentialId } = await request.json()
  await deleteCredential(credentialId)

  return NextResponse.json({ deleted: true })
}
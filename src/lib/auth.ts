import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const providers = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    })
  )
}

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    })

    const refreshed = await response.json()

    if (!response.ok) throw refreshed

    return {
      ...token,
      accessToken: refreshed.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + (refreshed.expires_in ?? 3600),
      // Keep existing refresh token if a new one wasn't issued
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)
    return { ...token, error: "RefreshAccessTokenError" }
  }
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async jwt({ token, account }) {
      // On initial sign in, capture tokens
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        }
      }

      // Token hasn't expired yet
      if (token.expiresAt && Date.now() < (token.expiresAt as number) * 1000) {
        return token
      }

      // Token has expired, try to refresh
      if (token.refreshToken) {
        return refreshAccessToken(token)
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      if (token.error) {
        (session as any).error = token.error
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me-in-production",
}

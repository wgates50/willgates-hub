# NextAuth.js Google OAuth Setup

## Status: Environment Variables Configured

The following environment variables have been successfully added to the Vercel project "willgates-hub":

### Environment Variables Set

1. **NEXTAUTH_SECRET** (Production only)
   - Value: `XucmgfXbJ0DL8uMGdmSizf8QOHEvVep4/N90UmMoNok=`
   - Encrypted in Vercel (sensitive)
   - Environment: Production
   - Purpose: Signs session tokens and encrypts credentials

2. **NEXTAUTH_URL** (Production only)
   - Value: `https://willgates.dev`
   - Environment: Production
   - Purpose: NextAuth callback URL for production

3. **NEXTAUTH_URL_DEV** (Preview & Development)
   - Value: `http://localhost:3000`
   - Environment: Preview, Development
   - Purpose: NextAuth callback URL for non-production environments

## Next Steps: Google Cloud Console Credentials

To complete the setup, you need to create OAuth 2.0 credentials in Google Cloud Console:

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project named "willgates-hub" (or similar)
3. Enable the Google+ API

### 2. Create OAuth 2.0 Credentials

1. Navigate to **Credentials** in the left menu
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add Authorized JavaScript origins:
   - `https://willgates.dev` (production)
   - `http://localhost:3000` (development)

5. Add Authorized redirect URIs:
   - `https://willgates.dev/api/auth/callback/google` (production)
   - `http://localhost:3000/api/auth/callback/google` (development)

6. Copy the **Client ID** and **Client Secret**

### 3. Add to NextAuth Configuration

Once you have the credentials, add these environment variables to Vercel:

```
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

**Important:** Add both to Production environment. For local development, add them to your `.env.local` file.

### 4. Update your NextAuth configuration

Your `pages/api/auth/[...nextauth].ts` should include:

```typescript
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
```

## Local Development (.env.local)

For local development, create a `.env.local` file with:

```
NEXTAUTH_SECRET=XucmgfXbJ0DL8uMGdmSizf8QOHEvVep4/N90UmMoNok=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

## Verification

Once all credentials are in place:

1. Test sign-in flow on production: `https://willgates.dev/api/auth/signin`
2. Test sign-in flow locally: `http://localhost:3000/api/auth/signin`
3. Verify Google popup appears and authentication works

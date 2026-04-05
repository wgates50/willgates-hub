/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async rewrites() {
    return {
      // beforeFiles rewrites are checked before pages/public files
      // This lets /apps/<slug> proxy to the external Vercel deployments
      beforeFiles: [
        {
          source: '/apps/whats-on-london',
          destination: 'https://whats-on-london.vercel.app',
        },
        {
          source: '/apps/whats-on-london/:path*',
          destination: 'https://whats-on-london.vercel.app/:path*',
        },
        {
          source: '/apps/album-club',
          destination: 'https://album-club.vercel.app',
        },
        {
          source: '/apps/album-club/:path*',
          destination: 'https://album-club.vercel.app/:path*',
        },
        {
          source: '/apps/musicbox',
          destination: 'https://musicbox.vercel.app',
        },
        {
          source: '/apps/musicbox/:path*',
          destination: 'https://musicbox.vercel.app/:path*',
        },
        {
          source: '/apps/taskflow',
          destination: 'https://taskflow.vercel.app',
        },
        {
          source: '/apps/taskflow/:path*',
          destination: 'https://taskflow.vercel.app/:path*',
        },
        {
          source: '/apps/click-tracker',
          destination: 'https://click-tracker.vercel.app',
        },
        {
          source: '/apps/click-tracker/:path*',
          destination: 'https://click-tracker.vercel.app/:path*',
        },
        {
          source: '/apps/upcoming',
          destination: 'https://upcoming.vercel.app',
        },
        {
          source: '/apps/upcoming/:path*',
          destination: 'https://upcoming.vercel.app/:path*',
        },
      ],
    }
  },
}
module.exports = nextConfig

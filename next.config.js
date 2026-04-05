/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async rewrites() {
    return {
      // beforeFiles rewrites are checked before pages/public files
      // This lets /apps/<slug> proxy to the external Vercel deployments
      // IMPORTANT: These must point to YOUR actual Vercel project domains, not generic ones
      beforeFiles: [
        {
          source: '/apps/whats-on-london',
          destination: 'https://whats-on-london-wgates50s-projects.vercel.app',
        },
        {
          source: '/apps/whats-on-london/:path*',
          destination: 'https://whats-on-london-wgates50s-projects.vercel.app/:path*',
        },
        {
          source: '/apps/album-club',
          destination: 'https://album-club-gamma.vercel.app',
        },
        {
          source: '/apps/album-club/:path*',
          destination: 'https://album-club-gamma.vercel.app/:path*',
        },
        {
          source: '/apps/musicbox',
          destination: 'https://musicbox-mu.vercel.app',
        },
        {
          source: '/apps/musicbox/:path*',
          destination: 'https://musicbox-mu.vercel.app/:path*',
        },
        {
          source: '/apps/taskflow',
          destination: 'https://taskflow-lilac-eta.vercel.app',
        },
        {
          source: '/apps/taskflow/:path*',
          destination: 'https://taskflow-lilac-eta.vercel.app/:path*',
        },
        {
          source: '/apps/click-tracker',
          destination: 'https://click-tracker-silk.vercel.app',
        },
        {
          source: '/apps/click-tracker/:path*',
          destination: 'https://click-tracker-silk.vercel.app/:path*',
        },
        {
          source: '/apps/upcoming',
          destination: 'https://pdevs-upcoming.vercel.app',
        },
        {
          source: '/apps/upcoming/:path*',
          destination: 'https://pdevs-upcoming.vercel.app/:path*',
        },
      ],
    }
  },
}
module.exports = nextConfig

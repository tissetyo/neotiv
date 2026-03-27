/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@neotiv/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig

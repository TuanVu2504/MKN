/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/map',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig

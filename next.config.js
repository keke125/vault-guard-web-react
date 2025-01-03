const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*
  // For development usage
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      }
    ]
  },
  */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'favicone.com',
        port: '',
        pathname: '/**',
        search: '?s=256',
      },
    ],
  },
  output: "standalone",
}

module.exports = withPWA(nextConfig);
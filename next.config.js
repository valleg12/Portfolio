/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Portfolio',
  assetPrefix: '/Portfolio/',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/Portfolio'
  }
}

module.exports = nextConfig 
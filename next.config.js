/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add webpack configuration here if needed
    return config
  },
  // Ensure static files are properly handled
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig

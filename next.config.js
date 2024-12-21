/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  webpack: (config, { isServer }) => {
    // Add support for importing files with extensions
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
    
    // Add path alias for src directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src'
    };
    
    return config;
  },
  // Ensure static files are properly handled
  poweredByHeader: false,
  generateEtags: false,
};

export default nextConfig;
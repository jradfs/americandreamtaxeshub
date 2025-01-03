/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': './src',
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    };
    return config;
  },
  poweredByHeader: false,
  generateEtags: false,
};

export default nextConfig;

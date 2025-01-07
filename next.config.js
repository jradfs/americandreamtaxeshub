/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  transpilePackages: [
    '@supabase/ssr',
    '@tanstack/react-table',
    'lucide-react',
  ],
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
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;

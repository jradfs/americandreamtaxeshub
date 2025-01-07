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
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      '@supabase/ssr',
      '@tanstack/react-table'
    ],
    serverComponentsExternalPackages: ['pg', 'postgres'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },
  productionBrowserSourceMaps: false,
  swcMinify: true,
}

export default nextConfig;


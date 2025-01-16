/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: "./tsconfig.json",
  },
  transpilePackages: ["@supabase/ssr", "@tanstack/react-table", "lucide-react"],
  webpack: (config, { isServer }) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@": "./src",
      },
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    };
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
    }
    return config;
  },
  poweredByHeader: false,
  generateEtags: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "@supabase/ssr",
      "@tanstack/react-table",
    ],
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["localhost:3000", "localhost:3001"],
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  productionBrowserSourceMaps: false,
  async redirects() {
    return [
      {
        source: '/auth/login',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
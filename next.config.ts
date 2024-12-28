const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbopack: false, // Ensure turbopack is enabled for faster builds
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;

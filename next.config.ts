const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },
  experimental: {
    // Increase timeout (default is 15s, set to 60s)
    images: {
      timeout: 60000,
    },
  },
};

export default nextConfig;

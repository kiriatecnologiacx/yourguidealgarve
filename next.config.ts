import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "wyligoajwjiveqrwiolz.supabase.co" },
      { protocol: "https", hostname: "img.rezdy.com" },
      { protocol: "https", hostname: "img.rezdy-staging.com" },
    ],
  },
  typedRoutes: false,
};

export default nextConfig;

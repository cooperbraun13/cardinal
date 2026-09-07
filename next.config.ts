import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve the auth artwork's clean gradients at its requested quality.
  images: { qualities: [75, 100] },
};

export default nextConfig;

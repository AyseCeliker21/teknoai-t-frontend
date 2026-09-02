import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Drop the "X-Powered-By: Next.js" response header — no reason to hand
  // recon tools a free framework fingerprint.
  poweredByHeader: false,
};

export default nextConfig;

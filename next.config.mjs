/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Serve the public landing page at "/" — the actual file lives at
      // /public/landing/index.html. Keeping it as a static file means JS/CSS
      // execute normally (no React conversion).
      { source: "/", destination: "/landing/index.html" },
      // Realtor-specific landing variant.
      { source: "/realtors", destination: "/landing-realtors/index.html" },
      { source: "/realtors/", destination: "/landing-realtors/index.html" },
    ];
  },
};

export default nextConfig;

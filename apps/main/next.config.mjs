/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    const apiBase = process.env.API_PROXY_URL || "http://localhost:5000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${apiBase}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

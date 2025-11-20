// Removed unused import of NextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5040/api/:path*', // Proxy to ASP.NET backend
      },
    ];
  },
};

module.exports = nextConfig;



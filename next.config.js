/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // оставить для Cloudflare
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/fitness/main',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

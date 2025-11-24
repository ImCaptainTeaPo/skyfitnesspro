module.exports = {
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




// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

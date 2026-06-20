/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/thvmaxart',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

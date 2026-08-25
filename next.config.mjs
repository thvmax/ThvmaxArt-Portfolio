/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // The previous site's routes, pointed at their nearest equivalent so
    // existing links and search results don't land on a 404.
    return [
      { source: '/thvmaxart', destination: '/', permanent: true },
      { source: '/sting-night-life', destination: '/work/sting-nightlife-repositioning', permanent: true },
      { source: '/art-direction', destination: '/work', permanent: true },
      { source: '/motion-production', destination: '/work', permanent: true },
      { source: '/digital-ui', destination: '/work', permanent: true },
      // the admin panel is retired — content now comes from the codebase
      { source: '/admin', destination: '/', permanent: true },
      { source: '/admin/:path*', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;

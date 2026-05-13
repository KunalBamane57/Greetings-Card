/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    // This allows specific origins to connect during development
    allowedDevOrigins: ['localhost:3000', '10.86.101.1:3000']
  }
};

export default nextConfig;

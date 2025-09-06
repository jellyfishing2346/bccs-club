/** @type {import('next').NextConfig} */
const nextConfig = {
  // trailingSlash removed to avoid 308 redirects on API routes
  images: {
    unoptimized: true
  }
};

export default nextConfig;

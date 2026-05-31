/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lint is run as its own gate (`npm run lint`); keep it out of `next build`
  // so a stray warning never blocks a deploy. Type-checking stays ON.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

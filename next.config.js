/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Mantendo a configuração existente
  images: {
    domains: ['i.imgur.com', 'placehold.co'], // adicionei placehold.co
  },
}

module.exports = nextConfig;

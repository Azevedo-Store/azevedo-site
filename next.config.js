/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar output standalone para Docker
  output: 'standalone',
  
  // Outras configurações podem ser adicionadas aqui
  // reactStrictMode: true,
  // images: {
  //   domains: ['exemplo.com'],
  // },
}

module.exports = nextConfig

/** @type {import('next').NextMode} */
const nextConfig = {
  typescript: {
    // Ignores errores de TypeScript en el despliegue
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignores advertencias/errores de ESLint en el despliegue
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
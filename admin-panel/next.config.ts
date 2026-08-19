import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite que o tablet (192.168.1.3) receba o Hot Reload (HMR) e não fique com a tela travada numa versão antiga!
  // @ts-expect-error (ignora o aviso de tipagem caso a versão do @types/next esteja desatualizada)
  allowedDevOrigins: ['192.168.1.3'],
};

export default nextConfig;

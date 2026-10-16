import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // スマホから手元の開発サーバーを開くため（http://MacBook-Pro.local:3000 のように Mac の名前で開く）
  allowedDevOrigins: ['*.local'],
};

export default nextConfig;

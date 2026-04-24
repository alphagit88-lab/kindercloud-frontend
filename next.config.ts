import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here - refreshing rewrites */
  reactCompiler: true,
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'commondatastorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    // Determine the backend URL.
    // Ensure the backend URL never ends with a trailing slash to prevent double-slash 404s
    const isDev = process.env.NODE_ENV === 'development';
    let backendUrl = process.env.BACKEND_URL;
    
    if (!backendUrl) {
      backendUrl = isDev ? 'http://localhost:5000' : 'https://kindercloud-backend.vercel.app';
    }

    if (backendUrl.endsWith('/')) {
      backendUrl = backendUrl.slice(0, -1);
    }
    
    return [
      {
        source: '/proxied-backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      }
    ];
  },
};

export default nextConfig;


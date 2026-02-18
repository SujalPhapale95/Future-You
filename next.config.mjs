import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
    dest: 'public',
    skipWaiting: true,
    register: true,
    disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['web-push'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default withPWA(nextConfig);

import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Future-You Contract',
        short_name: 'Future-You',
        description: 'Make promises to your future self and keep them.',
        start_url: '/dashboard',
        display: 'standalone',
        background_color: '#0e0c0a',
        theme_color: '#0e0c0a',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}

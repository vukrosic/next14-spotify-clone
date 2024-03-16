/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'wandering-rook-95.convex.cloud',
            },
        ],
    },
};

export default nextConfig;

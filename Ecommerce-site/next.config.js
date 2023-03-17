/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        backendSecret: process?.env.BACKEND_SECRET,
        primaryColor: process?.env.PRIMARY_COLOR,
    },
    output: 'standalone',
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                hostname: "**.supabase.co",
                protocol: "https",
            },
        ]
    }
}

module.exports = nextConfig

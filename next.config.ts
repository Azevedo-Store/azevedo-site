
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin();

const nextConfig : NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'azureuploadd.blob.core.windows.net',
            pathname: '/rag/**',
        }],
    }
};

export default withNextIntl(nextConfig);

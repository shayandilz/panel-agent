import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },
    env: {
        NEXT_PUBLIC_API_BASE_URL: 'https://api.rahnamayefarda.ir',
    },
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.rahnamayefarda.ir',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'rahnama1.s3.ir-thr-at1.arvanstorage.ir',
                port: '',
                pathname: '/**'
            },
        ]
    }
};

export default nextConfig;

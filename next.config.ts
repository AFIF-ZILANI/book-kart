import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    allowedDevOrigins: ["*"],
    images: {
        domains: ["images.unsplash.com", "media.istockphoto.com"],
    },
};

export default nextConfig;

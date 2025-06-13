import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    allowedDevOrigins: ["*"],
    images: {
        remotePatterns: [
            {
                protocol: "https",               //--------------------------
                hostname: "images.unsplash.com", //temprorary for development
            },
            {
                protocol: "https",                 //--------------------------
                hostname: "media.istockphoto.com", //temprorary for development
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "covers.openlibrary.org", //temprorary for development
            }
        ],
    },
};

export default nextConfig;

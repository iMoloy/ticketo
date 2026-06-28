import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
      "better-auth/react$": path.resolve("./node_modules/better-auth/dist/client/react/index.mjs"),
      "better-auth/react": path.resolve("./node_modules/better-auth/dist/client/react/index.mjs"),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      react: "./node_modules/react",
      "react-dom": "./node_modules/react-dom",
      "better-auth/react": "./node_modules/better-auth/dist/client/react/index.mjs",
      "better-auth/react$": "./node_modules/better-auth/dist/client/react/index.mjs",
    },
  },
};

export default nextConfig;

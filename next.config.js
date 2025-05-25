/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.geojson$/,
      use: ['json-loader']
    });
    return config;
  },
};

module.exports = nextConfig;

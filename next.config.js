/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      loader: 'json5-loader',
      type: 'javascript/auto'
    });
    return config;
  }
};

module.exports = nextConfig;

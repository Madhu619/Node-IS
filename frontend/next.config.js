/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  // If your repo is not at the root, uncomment and set these:
  // basePath: '/<your-repo-name>',
  // assetPrefix: '/<your-repo-name>/',
};

module.exports = nextConfig;

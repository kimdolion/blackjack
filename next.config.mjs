/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // https://deckofcardsapi.com/static/img/back.png
        protocol: "https",
        hostname: "deckofcardsapi.com",
        port: "",
        pathname: "/static/img/**",
      },
    ],
  },
};

export default nextConfig;

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['your-image-domain.com'], // Add your image domains here
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL, // Example of using environment variables
  },
};
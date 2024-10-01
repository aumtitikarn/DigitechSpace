// next.config.js
const { i18n } = require('./i18n');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'th'],
  },
  fallbackLng: {
    default: ['en'],
  },
  useSuspense: false,
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // เพิ่มโดเมนที่ต้องการให้รองรับ
  },
  eslint :{
    ignoreDuringBuilds: true
  }
};

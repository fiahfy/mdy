require('dotenv').config()
// const withCSS = require('@zeit/next-css')

module.exports = {
  env: {
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
  },
  // exportTrailingSlash: true,
  // exportPathMap: function () {
  //   return {
  //     '/': { page: '/' },
  //     '/login': { page: '/login' },
  //     '/notes': { page: '/notes' },
  //     '/notes/trash': { page: '/notes/trash' },
  //     '/password-reset': { page: '/password-reset' },
  //     '/register': { page: '/register' },
  //     '/settings': { page: '/settings' },
  //   }
  // },
}

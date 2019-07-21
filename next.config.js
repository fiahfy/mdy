require('dotenv').config()
const withCSS = require('@zeit/next-css')

const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = withCSS({
  webpack: (config) => {
    config.plugins = config.plugins || []

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ]

    return config
  },
  exportTrailingSlash: true,
  exportPathMap: function() {
    return {
      '/': { page: '/' },
      '/login': { page: '/login' },
      '/notes': { page: '/notes' },
      '/notes/trash': { page: '/notes/trash' },
      '/password-reset': { page: '/password-reset' },
      '/register': { page: '/register' },
      '/settings': { page: '/settings' }
    }
  }
})

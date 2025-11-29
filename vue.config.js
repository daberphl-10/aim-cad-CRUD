const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // Ensure environment variables are loaded
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // Log environment variables for debugging (remove in production)
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Environment variables loaded:');
      console.log('VUE_APP_GOOGLE_MAPS_API_KEY:', process.env.VUE_APP_GOOGLE_MAPS_API_KEY ? '✅ Found' : '❌ Not found');
    }
  }
})

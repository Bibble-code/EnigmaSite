const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:8081',  // Your Spring Boot backend
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }  // Optional, keeps path unchanged
      }
    }
  }
})

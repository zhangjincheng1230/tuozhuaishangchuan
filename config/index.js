'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
// let devHost = '172.16.2.73'
let devHost = '172.16.5.107'

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api/zxkj': {
        target: `http://${devHost}:8083/`,
        pathRewrite: {'^/api/zxkj' : ''},
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: `http://${devHost}:8081/`,
        pathRewrite: {'^/api' : ''},
        changeOrigin: true,
        secure: false
      },
      '/dev_api/zncs': {
        target: `http://${devHost}:8083/`,
        pathRewrite: {'^/dev_api' : ''},
        changeOrigin: true,
        secure: false,
      },
      '/zncs': {
        target: `http://${devHost}:8083/`,
        // pathRewrite: {'' : ''},
        changeOrigin: true,
        secure: false,
      },
      '/glic': {
        target: `http://${devHost}:8083/`,
        // pathRewrite: {'' : ''},
        changeOrigin: true,
        secure: false,
      },
      '/gl': {
        target: `http://${devHost}:8083/`,
        // pathRewrite: {'' : ''},
        changeOrigin: true,
        secure: false,
      },
      '/bdset': {
        target: `http://${devHost}:8083/`,
        // pathRewrite: {'' : ''},
        changeOrigin: true,
        secure: false,
      },
      '/icset': {
        target: `http://${devHost}:8083/`,
        // pathRewrite: {'' : ''},
        changeOrigin: true,
        secure: false,
      },
      '/voucher-manage': {
        target: `http://${devHost}:8083/`,
        // pathRewrite: {'' : ''},
        changeOrigin: true,
        secure: false,
      },
      '/sm_user': {
        target: `http://${devHost}:8083/`,
        // pathRewrite: {'' : ''},
        changeOrigin: true,
        secure: false,
      },
      '/dev_api/auth': {
        target: `http://${devHost}:8084/`,
        pathRewrite: {'^/dev_api/auth' : ''},
        changeOrigin: true,
        secure: false
      },
      '/dev_api/zxkj': {
        target: `http://${devHost}:8083/`,
        pathRewrite: {'^/dev_api/zxkj' : ''},
        changeOrigin: true,
        secure: false,
      },
      '/dev_api/report': {
        target: `http://${devHost}:8085/`,
        pathRewrite: {'^/dev_api/report' : ''},
        changeOrigin: true,
        secure: false
      }
    },

    // Various Dev Server settings
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    port: 8521, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: '#inline-eval-cheap-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

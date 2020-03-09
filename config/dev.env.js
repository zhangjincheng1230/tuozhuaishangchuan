'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"/DZF_KJ"',
  VUE_APP_BASE_API: '"/dev_api"',
  VUE_APP_OLD_API: '"/DZF_KJ"',
  VUE_APP_API_SUFFIX: '".action"'
})

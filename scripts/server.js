const { isEnvDevelopment, isMockEnable, isHttpsEnable, proxy } = require('./environment');
const { ip } = require('./utils');

module.exports = isEnvDevelopment
  ? {
    before: (app) => {
      isMockEnable && require('./mock')(app);
    },
    https: isHttpsEnable,
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    host: ip(),
    port: 8888,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/',
    proxy: proxy ? proxy : false,
    quiet: false,
    watchOptions: {
      poll: false
    }
  }
  : {};

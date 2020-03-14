const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { isEnvDevelopment } = require('./environment');
const hasha = require('hasha');
const resolve = (p = '') => path.resolve(__dirname, '../', p);

const getCssLoaders = (cssOptions = {}) => {
  const loaders = [
    {
      loader: isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: isEnvDevelopment,
        // javascriptEnabled: true,
        ...cssOptions
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        sourceMap: isEnvDevelopment
      }
    }
  ];
  return loaders;
};

const getLessLoaders = () => {
  const loaders = getCssLoaders();
  loaders.push({
    loader: 'less-loader',
    options: {
      sourceMap: isEnvDevelopment,
      javascriptEnabled: true
      // paths: [path.resolve(__dirname, '../', 'node_modules')]
    }
  });
  return loaders;
};

const getScssLoaders = () => {
  const loaders = getCssLoaders();
  loaders.push({
    loader: 'sass-loader',
    options: {
      sourceMap: isEnvDevelopment
    }
  });
  return loaders;
};

const getStylusLoaders = () => {
  const loaders = getCssLoaders();
  loaders.push({
    loader: 'stylus-loader',
    options: {
      sourceMap: isEnvDevelopment
    }
  });
  return loaders;
};

const ip = () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  const family = 'ipv4';
  const isLoopback = addr => /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/.test(addr) ||
    /^fe80::1$/.test(addr) ||
    /^::1$/.test(addr) ||
    /^::$/.test(addr);
  const all = Object.keys(interfaces)
    .map((nic) => {
      const addresses = interfaces[nic].filter((details) => {
        details.family = details.family.toLowerCase();
        if (details.family !== family || isLoopback(details.address)) {
          return false;
        }
        return true;
      });
      return addresses.length ? addresses[0].address : undefined;
    })
    .filter(Boolean);
  return !all.length ? ip.loopback(family) : all[0];
};

const build = (webpackConfig = {}, callback) => {
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    if (err) {
      throw err;
    }
    process.stdout.write(`${stats.toString({
      colors: true,
      modules: false,
      children: false, // if you are using ts-loader, setting this to true will make tyescript errors show up during build
      chunks: false,
      chunkModules: false
    })}\n\n`);
    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }
    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow('  Tip: built files are meant to be served over an HTTP server.\n' +
          "  Opening index.html over file:// won't work.\n"));
    callback && callback();
  });
};

const getHasha = (filename) => {
  return hasha.fromFileSync(filename, {
    algorithm: 'md5'
  }); // 生成hashcode
};

module.exports = {
  resolve,
  getCssLoaders,
  getLessLoaders,
  getScssLoaders,
  getStylusLoaders,
  ip,
  build,
  getHasha
};

'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { resolve, build } = require('./utils');
const { isEnvDevelopment, dllDir } = require('./environment');

const getDllConfig = (dependencies = []) => ({
  target: 'web',
  mode: isEnvDevelopment ? 'development' : 'production',
  entry: {
    dependencies
  },
  output: {
    path: dllDir,
    filename: '[name].js',
    library: '[name]_[hash]'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      })
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DllPlugin({
      context: resolve(),
      path: path.join(dllDir, 'dependencies-manifest.json'),
      name: '[name]_[hash]'
    })
  ]
});

if (dllDir) {
  const cachedPackagePath = path.join(dllDir, 'package.json');
  const currentPackagePath = resolve('package.json');
  let cachedPackage = {};
  let currentPackage = {};
  try {
    cachedPackage = require(cachedPackagePath);
  } catch (error) {
  } finally {
    try {
      currentPackage = require(currentPackagePath);
    } catch (error) {
    } finally {
      if (JSON.stringify(cachedPackage) !== JSON.stringify(currentPackage)) {
        // 如果两个package.json不同
        const dependencies = Object.keys(currentPackage.dependencies || {});
        if (dependencies.length) {
          build(getDllConfig(dependencies), () => {
            // ... 之后需要把新的package.json扔到缓存里
            console.log(`copy file from ${currentPackagePath} to ${cachedPackagePath}`);
            fs.copyFileSync(currentPackagePath, cachedPackagePath);
          });
        }
      }
    }
  }
}

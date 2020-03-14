'use strict';
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HappyPack = require('happypack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { resolve, getCssLoaders, getLessLoaders, getScssLoaders, getStylusLoaders, getHasha } = require('./utils');
const {
  version,
  env,
  target,
  isEnvDevelopment,
  publicPath,
  isAnalyzerEnable,
  useEslint,
  dllDir,
  splitChunks,
  destPath
} = require('./environment');

const getRules = () => {
  const rules = [
    {
      test: /\.(js|jsx)$/,
      include: [resolve('src')],
      use: !isEnvDevelopment
        ? {
          loader: 'happypack/loader?id=babel'
        }
        : {
          loader: 'babel-loader',
          options: {
            cacheDirectory: resolve('cache')
          }
        }
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      include: [resolve('src')],
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'asset/img/[name].[hash:8].[ext]'
        }
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      include: [resolve('src')],
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'asset/media/[name].[hash:8].[ext]'
        }
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      include: [resolve('src')],
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'asset/fonts/[name].[hash:8].[ext]'
        }
      }
    },
    {
      test: /\.css$/,
      include: [resolve('src')],
      use: getCssLoaders({
        importLoaders: 1
      })
    },
    {
      test: /\.less$/,
      include: [resolve('src')],
      use: getLessLoaders({
        importLoaders: 2
      })
    },
    {
      test: /\.scss$/,
      include: [resolve('src')],
      use: getScssLoaders({
        importLoaders: 2
      })
    },
    {
      test: /\.styl$/,
      include: [resolve('src')],
      use: getStylusLoaders({
        importLoaders: 2
      })
    }
  ];
  if (isEnvDevelopment && useEslint) {
    rules.unshift({
      test: /\.(js|jsx)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [resolve('src')]
    });
  }
  return rules;
};

const getOptimization = () => {
  const optimizations = {
    minimize: false,
    runtimeChunk: 'single'
  };
  if (!isEnvDevelopment) {
    optimizations.minimize = true;
    optimizations.minimizer = [
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
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true
          }
        }
      })
    ];
  }
  return optimizations;
};

const getPlugin = () => {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.TIMESTAMP': JSON.stringify(+new Date()),
      'process.env.VERSION': JSON.stringify(version),
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.TARGET': JSON.stringify(target)
    }), // 全局变量替换
    new webpack.NoEmitOnErrorsPlugin(), // 编译错误时跳过输出阶段
    new HtmlWebpackPlugin({
      filename: isEnvDevelopment ? path.join(destPath, 'index.html') : path.join(destPath, 'cms/index.html'),
      template: resolve('src/template/index.html'),
      favicon: resolve('src/template/favicon.ico'),
      gtag: 'UA-135935262-1',
      zoom: `<script>${fs.readFileSync(resolve('src/template/zoom.js'))}</script>`,
      dll: dllDir
        ? `<script type="text/javascript" src="${publicPath.replace(/\/$/, '')}/asset/js/dependencies.js?v=${getHasha(path.join(dllDir, 'dependencies.js'))}" crossorigin="anonymous"></script>`
        : '',
      loading: {
        html: fs.readFileSync(resolve('src/template/loading/index.html')),
        css: `<style>${fs.readFileSync(resolve('src/template/loading/index.css'))}</style>`
      },
      inject: true,
      chunksSortMode: isEnvDevelopment ? 'auto' : 'dependency',
      minify: isEnvDevelopment
        ? false
        : {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
    }) // 通过模板创建html
  ];
  if (!isEnvDevelopment) {
    return plugins
      .concat([
        new webpack.ProgressPlugin(),
        new ScriptExtHtmlWebpackPlugin({
          custom: {
            test: /\.js$/,
            attribute: 'crossorigin',
            value: 'anonymous'
          },
          preload: {
            test: /\.js$/
          }
        }),
        dllDir
          ? new CopyWebpackPlugin([
            {
              from: path.join(dllDir, 'dependencies.js'),
              to: path.join(destPath, 'asset/js')
            },
            {
              from: path.join(dllDir, 'dependencies-manifest.json'),
              to: destPath
            }
          ])
          : null,
        dllDir
          ? new webpack.DllReferencePlugin({
            context: resolve(),
            manifest: path.join(dllDir, 'dependencies-manifest.json')
          })
          : null,
        splitChunks && !dllDir
          ? new webpack.optimize.SplitChunksPlugin({
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
              react: {
                // 所有react开头的单独打一个包
                test: /[\\/]node_modules[\\/]react/,
                priority: -20
              },
              third: {
                // 所有node_modules的单独打一个包
                test: /[\\/]node_modules[\\/]/,
                priority: -100
              },
              default: {
                minChunks: 2,
                priority: -10,
                reuseExistingChunk: true
              }
            }
          })
          : null, // 代码拆分优化
        isAnalyzerEnable &&
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: path.join(destPath, 'report/index.html')
          }),
        new MiniCssExtractPlugin({
          filename: 'asset/css/[name].[contenthash:8].css',
          chunkFilename: 'asset/css/[name].[contenthash:8].chunk.css'
        }),
        new webpack.optimize.ModuleConcatenationPlugin(), // 作用域提升优化
        new HappyPack({
          // 多线程运行 默认是电脑核数-1
          id: 'babel', // 对于loaders id
          loaders: ['babel-loader?cacheDirectory=cache'], // 是用babel-loader解析
          threadPool: HappyPack.ThreadPool({ size: 1 }),
          verboseWhenProfiling: true // 显示信息
        }),
        new ManifestPlugin({
          fileName: 'asset-manifest.json',
          publicPath: publicPath
        })
      ])
      .filter(Boolean);
  } else {
    return plugins
      .concat([
        new webpack.HotModuleReplacementPlugin(), // 模块热替换插件
        new webpack.NamedModulesPlugin() // 当开启 HMR 的时候使用该插件会显示模块的相对路径
      ])
      .filter(Boolean);
  }
};

function getConfig() {
  const config = {
    target: 'web',
    mode: isEnvDevelopment ? 'development' : 'production',
    devtool: isEnvDevelopment ? 'eval-source-map' : false,
    context: resolve(),
    entry: {
      app: [resolve('src/index.js')]
    },
    output: {
      path: destPath,
      filename: isEnvDevelopment ? 'asset/js/bundle.js' : 'asset/js/[name].[chunkhash:8].js',
      chunkFilename: isEnvDevelopment ? 'asset/js/[name].chunk.js' : 'asset/js/[name].[chunkhash:8].chunk.js',
      publicPath: isEnvDevelopment ? '/' : publicPath,
      crossOriginLoading: isEnvDevelopment ? false : 'anonymous'
    },
    optimization: getOptimization(),
    resolve: {
      extensions: ['.js', '.json', '.jsx'],
      modules: [resolve('src'), 'node_modules']
    },
    module: {
      rules: getRules()
    },
    externals: {},
    plugins: getPlugin(),
    devServer: require('./server')
  };

  return config;
}
const config = getConfig();
module.exports = config;

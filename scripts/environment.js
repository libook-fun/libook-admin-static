const path = require('path');
const env = process.env.NODE_ENV || 'development';
const target = process.env.TARGET || 'spa';
const dll = process.env.DLL === '0' ? false : true;

const environment = {
  env, // 环境字符串
  target, // 构建目标
  version: process.env.VERSION || require('../package.json').version, // 当前项目package.json的version版本
  isEnvDevelopment: env === 'development', // 是否属于开发
  isAnalyzerEnable: !!process.env.ANALYZER, // 是否开启构建分析
  isMockEnable: !!process.env.MOCK, // 是否开启mock功能
  isHttpsEnable: !!process.env.HTTPS, // 是否开启https代理
  useEslint: false, // 是否启用eslint
  dllDir: env !== 'development' && dll ? path.resolve(process.cwd(), '.dll') : false, // 是否启用dll
  splitChunks: !!process.env.SPLIT_CHUNKS, // 是否启用dll
  proxy: require('./proxy.js'), // 开发服务器代理配置
  publicPath: process.env.PUBLIC_PATH || './', // 静态资源前缀
  destPath: path.resolve(process.cwd(), target === 'githubpages' ? 'docs' : 'dist')
};

module.exports = environment;

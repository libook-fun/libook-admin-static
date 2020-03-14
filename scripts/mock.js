// const path = require('path')
// const chokidar = require('chokidar')
const chalk = require('chalk');
const { resolve } = require('./utils');
// let ss = 0
module.exports = function applyMock(app) {
  // console.log(ss++, app)
  // 获取mock config
  const config = require('../mock/config');
  Object.keys(config).forEach((key) => {
    const keyParsed = parseKey(key);
    app[keyParsed.method](keyParsed.path, createMockHandler(keyParsed.method, keyParsed.path, config[key]));
  });
  // const watcher = chokidar.watch([resolve('mock')], {
  //   ignored: /node_modules/,
  //   ignoreInitial: true
  // })
  // watcher.on('change', path => {
  //   console.log(chalk.green('CHANGED'), path)
  //   watcher.close()
  //   applyMock(app)
  // })
};

function parseKey(key) {
  let method = 'get';
  let path = key;

  if (key.indexOf(' ') > -1) {
    const splited = key.split(' ');
    method = splited[0].toLowerCase();
    path = splited[1];
  }

  return { method, path };
}

function createMockHandler(method, path, value) {
  return function mockHandler(...args) {
    const res = args[1];
    if (typeof value === 'function') {
      // 如果是function,执行
      value(...args);
    } else {
      res.json(value);
    }
  };
}

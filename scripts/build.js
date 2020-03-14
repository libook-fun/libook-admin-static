'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const { build } = require('./utils');
const webpackConfig = require('./config');
build(webpackConfig);

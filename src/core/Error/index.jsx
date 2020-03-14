/**
 * @file 异常页面组件
 * @author mengchen <sisimengchen@gmail.com>
 */
import React from 'react';
import config from './config';
import './index.less';

const CoreException = ({ type = '404', title, desc, img, actions, ...rest }) => (
  <div id="core-exception" {...rest}>
    <div className="image-block">
      <img src={img || config[type].img} />
    </div>
    <div className="content-block">
      <h1>{title || config[type].title}</h1>
      <div className="desc">{desc || config[type].desc}</div>
    </div>
  </div>
);
export default CoreException;

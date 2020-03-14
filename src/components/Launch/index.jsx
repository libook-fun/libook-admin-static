/**
 * @file 启动画面组件
 * @author mengchen <sisimengchen@gmail.com>
 */
import React from 'react';
import './index.less';

const Launch = ({ appLoaded = false }) => (
  <div id="components-launch" className={appLoaded ? 'disabled' : null}>
    <div className="launch">
      <img src={require('./assets/react.svg')} />
      <p>Launch...</p>
    </div>
  </div>
);

export default Launch;

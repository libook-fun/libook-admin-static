/**
 * @file 页尾组件
 * @author mengchen <sisimengchen@gmail.com>
 */
import React, { Component } from 'react';
import './index.less';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <footer id="components-footer">
        <section className="copyright">Copyright (c) 2019-present sisimengchen@gmail.com.</section>
      </footer>
    );
  }
}

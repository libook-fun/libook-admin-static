import React, { PureComponent } from 'react';
import './index.less';

export default class HomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="pages-home">libook</div>;
  }
}

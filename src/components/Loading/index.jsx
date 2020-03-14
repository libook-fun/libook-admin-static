/**
 * @file 加载组件
 * @author mengchen <sisimengchen@gmail.com>
 */
import React from 'react';
import { connect } from 'react-redux';
import './index.less';

const Loading = ({ loading = false }) => (
  <div id="components-loading">
    <div className={`loading${loading ? ' active' : ''}`} />
  </div>
);

const mapStateToProps = ({ ui }) => ({
  loading: ui.loading
});

export default connect(mapStateToProps)(Loading);

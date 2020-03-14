/**
 * @file 页头组件
 * @author mengchen <sisimengchen@gmail.com>
 */
import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { history } from 'core/history';
import './index.less';

class Header extends Component {
  static defaultProps = {
    back: true, // false-不显示 true-显示（默认采用history.goback回退） 'xxx'默认直接跳转指定的url
    title: '',
    userName: undefined,
    userAvatar: undefined
  };

  state = {};

  static getDerivedStateFromProps(props, state) {
    return state;
  }

  render() {
    return (
      <header id="components-header">
        <DocumentTitle title={this.props.title} />
        <div className="secondary">
          {this.props.back ? (
            <a
              className="back"
              href={null}
              onClick={() => {
                if (this.props.back.length) {
                  history.push(this.props.back);
                } else {
                  history.goBack();
                }
              }}
            >
              <img src={require('./assets/icon-chevron-left.svg')} />
            </a>
          ) : null}
          <div className="title">
            {this.props.title}
            {this.props.userName}
          </div>
          <img
            className="avatar"
            src={this.props.userAvatar ? this.props.userAvatar : require('./assets/icon-account.svg')}
          />
        </div>
      </header>
    );
  }
}

const mapStateToProps = ({ header, user }) => ({
  title: header.title,
  userName: user.name,
  userAvatar: user.avatar
});

export default connect(mapStateToProps)(Header);

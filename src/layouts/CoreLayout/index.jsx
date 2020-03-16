import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CoreRouter from 'core/Router';
import { history } from 'core/history';
import { Layout, Menu, Breadcrumb } from 'antd';
import Icon from '@ant-design/icons';
import { menus } from './common';
import './index.less';

class CoreLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { pathname } = this.props;
    return (
      <Layout className="layouts-corelayout">
        <Layout.Header>
          <div className="logo" />
        </Layout.Header>
        <Layout>
          <Layout.Sider
            className="sidebar"
            width={200}
            style={{ background: '#fff' }}
          >
            <Menu
              mode="inline"
              onSelect={item => {
                const { key } = item;
                history.push(key);
              }}
              selectedKeys={[pathname]}
              style={{ height: '100%', borderRight: 0 }}
            >
              {menus.map((menu = {}, index) => {
                console.log(menu);
                return (
                  <Menu.Item key={menu.key}>
                    <menu.Icon />
                    <span>{menu.value}</span>
                  </Menu.Item>
                );
              })}
            </Menu>
          </Layout.Sider>
          <Layout style={{ padding: '24px 24px 24px' }}>
            <Layout.Content
              style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                minHeight: 280
              }}
            >
              <CoreRouter />
            </Layout.Content>
          </Layout>
        </Layout>
        {/* <Layout.Footer /> */}
      </Layout>
    );
  }
}

const mapStateToProps = function({ router }) {
  const pathname =
    router && router.location && router.location.pathname
      ? router.location.pathname
      : '';
  return {
    pathname: pathname
  };
};
export default connect(mapStateToProps)(CoreLayout);

import React, { Fragment } from 'react';
import CoreRouter from 'core/Router';
import { history } from 'core/history';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './index.less';

const CoreLayout = () => (
  <Layout>
    <Layout.Header>
      <div className="logo" />
    </Layout.Header>
    <Layout>
      <Layout.Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          onSelect={(item) => {
            const { key } = item;
            history.push(key);
          }}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="/cms">
            <Icon type="home" />
            <span>首页</span>
          </Menu.Item>
          <Menu.Item key="/cms/category">
            <Icon type="container" />
            <span>分类管理</span>
          </Menu.Item>
          <Menu.Item key="/cms/book">
            <Icon type="book" />
            <span>书籍管理</span>
          </Menu.Item>
          <Menu.Item key="/cms/exhibition">
            <Icon type="account-book" />
            <span>展位管理</span>
          </Menu.Item>
          <Menu.Item key="/cms/recommender">
            <Icon type="fire" />
            <span>推荐管理</span>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        {/* <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
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
    <Layout.Footer />
  </Layout>
);

export default CoreLayout;

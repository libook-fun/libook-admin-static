/* eslint-disable no-unused-vars */
/**
 * @file 用户权限校验路由组件
 * @author mengchen <sisimengchen@gmail.com>
 * @module components/Authorized/AuthorizedRoute
 */
import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import queryString from 'query-string';
import Loadable from 'react-loadable';
import { Instagram } from 'react-content-loader';
import { User } from 'utils/user';
import store from 'redux/store';

const getUserLoadableComponent = () => Loadable({
  loader: () => User.get(),
  loading: (props) => {
    if (props.error) {
      return (
          <Redirect
            to={{
              pathname: '/page/login',
              search: `?target=${encodeURIComponent(window.location.href)}`
            }}
          />
      );
    } else if (props.pastDelay) {
      return <Instagram />;
    } else {
      return null;
    }
  },
  render: (data, props) => props.render(data)
});

const AuthorizedRoute = ({
  // layout: Layout = Fragment,
  component: PageComponent,
  authority = [],
  title,
  location = {},
  ...rest
}) => {
  location.query = location.search ? queryString.parse(location.search) : {};
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        store.dispatch({ type: 'PAGE_LOAD', payload: { title } });
        const { location = {} } = routeProps;
        // console.log(location);
        const { pathname = '/' } = location;
        // /sign/ 下的所有页面需要做登录判断， 其他的不用
        const isSignPage = pathname.indexOf('/page/auth/') === 0;
        if (!isSignPage) {
          return <PageComponent {...routeProps} />;
        }
        const UserLoadableComponent = getUserLoadableComponent();
        return (
          <UserLoadableComponent
            render={(data) => {
              if (!User.isAuthority(authority)) {
                // 判断权限
                return (
                  <Redirect
                    to={{
                      pathname: '/page/forbidden'
                    }}
                  />
                );
              }
              return <PageComponent {...routeProps} />;
            }}
          />
        );
      }}
    />
  );
};

export default AuthorizedRoute;

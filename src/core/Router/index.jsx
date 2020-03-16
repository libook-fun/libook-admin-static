/* eslint-disable no-unused-vars */
/**
 * @file 路由组件
 * @author mengchen <sisimengchen@gmail.com>
 */
import React from 'react';
import { Router, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from 'core/history';
import routes from 'core/routes';

import AuthorizedRoute from './AuthorizedRoute';

const CoreRouter = () => (
  <ConnectedRouter history={history}>
    <Switch>
      {routes.map((route = {}, index) => (
        // console.log(route);
        <AuthorizedRoute key={route.path || index} {...route} />
      ))}
    </Switch>
  </ConnectedRouter>
);

export default CoreRouter;

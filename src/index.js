/* eslint-disable no-unused-vars */
import 'assets/styles/index.less';
import 'assets/styles/antd.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'redux/store';
import { User } from 'utils/user';
import App from './app.jsx';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
  () => {
    store.dispatch({ type: 'APP_LOADED' });
    // User.get(true)
    //   .then(() => {
    //     store.dispatch({ type: 'APP_LOADED' });
    //   })
    //   .catch((e) => {
    //     store.dispatch({ type: 'APP_LOADED' });
    //   });
  }
);

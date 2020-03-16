import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import createRootReducer from 'redux/reducers';
import { history } from 'core/history';
import defaultState from '../defaultState';
import { promiseMiddleware } from '../middleware';

const middleware = [
  createLogger(),
  promiseMiddleware,
  routerMiddleware(history)
];

const store = createStore(
  createRootReducer(history),
  defaultState,
  applyMiddleware(...middleware)
);

export default store;

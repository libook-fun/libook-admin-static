import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from 'redux/reducers';
import defaultState from '../defaultState';
import { promiseMiddleware } from '../middleware';

const middleware = [createLogger(), promiseMiddleware];

const store = createStore(rootReducer, defaultState, applyMiddleware(...middleware));

export default store;

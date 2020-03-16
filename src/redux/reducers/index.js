import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import app from './app';
import data from './data';
import header from './header';
import ui from './ui';
import user from './user';

const rootReducer = history =>
  combineReducers({
    app,
    data,
    header,
    ui,
    user,
    router: connectRouter(history)
  });

export default rootReducer;

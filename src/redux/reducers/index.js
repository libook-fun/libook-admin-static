import { combineReducers } from 'redux';
import app from './app';
import data from './data';
import header from './header';
import ui from './ui';
import user from './user';

export default combineReducers({
  app,
  data,
  header,
  ui,
  user
});

import { setToken } from 'utils/token';
import { User } from 'utils/user';
import { request } from 'utils/request';

export const login = (data = {}) => request.postForm({ url: '/api/login', data }).then((data = {}) => {
  setToken(data.token);
  return User.get(true);
});

export const register = (data = {}) => request.postForm({ url: '/api/reg', data }).then((data = {}) => {
  setToken(data.token);
  return User.get(true);
});

export const logout = () => request.get({ url: '/api/logout' }).then(() => setToken(null));

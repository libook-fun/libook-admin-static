/**
 * @file 登录标识
 * @author mengchen <sisimengchen@gmail.com>
 */

let token = window.localStorage.getItem('token') || null;

export const setToken = (_token) => {
  token = _token;
  token ? window.localStorage.setItem('token', token) : window.localStorage.removeItem('token');
};

export const getToken = () => window.localStorage.getItem('token') || null;

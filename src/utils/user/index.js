/* eslint-disable no-unused-vars */
import { request } from 'utils/request';
import { getToken } from 'utils/token';
import store from 'redux/store';

export const User = {
  userData: undefined,
  promise: undefined,
  url: '/api/auth/user/current',
  get: function(force = false, options = {}) {
    if (!force && this.promise) {
      return this.promise;
    }
    force && (this.promise = undefined);
    if (!this.promise) {
      this.promise = request
        .get({
          url: this.url,
          options: {
            report: true,
            unloginOpen: false,
            ...options
          }
        })
        .then((data = {}) => this.onSuccess(data))
        .catch((res) => {
          this.reset();
          throw res;
        });
    }
    return this.promise;
  },
  getSync: function() {
    return this.userData;
  },
  onSuccess: function(data) {
    window.__isLogin = true;
    this.userData = this._formate(data);
    store.dispatch({ type: 'USER_UPDATE', payload: this.userData });
    return this.userData;
  },
  _formate: function(data) {
    const { authority = [] } = data;
    this.authorityMap = {};
    authority.forEach((author) => {
      this.authorityMap[`${author}`] = true;
    });
    return data;
  },
  reset: function() {
    window.__isLogin = false;
    this.userData = undefined;
    store.dispatch({ type: 'USER_UPDATE', payload: {} });
  },
  isLogin: function() {
    // 只能证明用户在某段时间登陆成功过
    return !!window.__isLogin && getToken();
  },
  isAuthority: function(denyAuthors = [], allowAuthors = [], strict = false) {
    if (!this.authorityMap) {
      return !strict;
    }
    const { authorityMap = {} } = this;
    const denyLength = denyAuthors.length;
    if (denyLength) {
      for (let i = 0; i < denyLength; i++) {
        // 只要有一个属于则拒绝
        if (authorityMap[`${denyAuthors[i]}`]) {
          return false;
        }
      }
    }
    const allowLength = allowAuthors.length;
    if (allowLength) {
      for (let j = 0; j < allowLength; j++) {
        // 只要有一个属于则同意
        if (authorityMap[`${allowAuthors[j]}`]) {
          return true;
        }
      }
    }
    return !strict;
  },
  logout: function() {
    window.location.href = '/logout';
  }
};

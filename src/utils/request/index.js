import axios from 'axios';
import store from 'redux/store';

export const Loading = {
  cacheList: [],
  isLoading: false,
  start: function(cache) {
    if (this.cacheList.length === 0 && this.closeFun == null && this.isLoading === false) {
      this.isLoading = true;
      store.dispatch({ type: 'UI_LOADING', payload: true });
    }
    this.cacheList.push(cache);
  },
  end: function(cache) {
    const index = this.cacheList.indexOf(cache);
    if (index > -1) {
      this.cacheList.splice(index, 1);
    }
    if (this.cacheList.length === 0 && this.isLoading === true) {
      this.isLoading = false;
      store.dispatch({ type: 'UI_LOADING', payload: false });
    }
  }
};

export function getBaseUrl() {
  // 开发环境
  // if (process.env.NODE_ENV === 'development' || process.env.TARGET === 'githubpages') {
  //   return 'https://easy-mock.com/mock/5b04275f5fa2b20fbca4a45b';
  // }
  return '';
}

// https://github.com/axios/axios
const instance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 10000,
  headers: {
    Accept: '*/*'
  }
});

const requestLocker = {};

const defaultOption = {
  loading: true,
  report: true,
  unloginOpen: true,
  unkonwErrorRetry: 2
};

const requestfactory = function(url, axiosOptions = {}, options = {}) {
  options = {
    ...defaultOption,
    ...options
  };
  if (options.key && requestLocker[`${options.key}`]) {
    const error = new Error(`${options.key} key is working`);
    return Promise.reject(error);
  }
  options.key && (requestLocker[`${options.key}`] = true);
  const cache = +new Date();
  options.loading && Loading.start(cache);
  const newAxiosOptions = { ...axiosOptions, ...{ url } };
  newAxiosOptions.params = {
    ...newAxiosOptions.params,
    cache
  };
  return instance
    .request(newAxiosOptions)
    .then((response = {}) => {
      options.loading && Loading.end(cache);
      options.key && (requestLocker[`${options.key}`] = false);
      const { data = {} } = response;
      if (data.code === 200) {
        return data.data;
      }
      if (typeof data === 'string') {
        return data;
      }
      let error;
      if (data.code === 401) {
        error = new Error(data.message || '您未登录或者登陆已经失效，请重新登录');
      } else if (data.code === 403) {
        error = new Error(data.message || '操作权限不足，提权请联系商家老板或超管');
      } else {
        error = new Error(data.message || '系统繁忙请稍后重试');
      }
      error.code = data.code;
      error.data = data.data;
      error.response = response;
      error.isApiError = true;
      throw error;
    })
    .catch((error) => {
      const message = error.message && error.message.toLowerCase();
      if (message.indexOf('network error') > -1) {
        const { unkonwErrorRetry } = options;
        if (unkonwErrorRetry > 0) {
          return requestfactory(url, axiosOptions, {
            ...options,
            unkonwErrorRetry: unkonwErrorRetry - 1
          });
        }
      }
      if (message.indexOf('timeout') > -1) {
        error.isTimeout = true;
      }
      options.loading && Loading.end(cache);
      options.key && (requestLocker[`${options.key}`] = false);
      throw error;
    });
};

const serialize = function(obj = {}) {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
    }
  }
  return str.join('&');
};

export const request = {
  get: function({ url, data = {}, options = {}, axiosOptions = {} }) {
    const newAxiosOptions = {
      method: 'get',
      params: data,
      ...axiosOptions
    };
    return requestfactory(url, newAxiosOptions, options);
  },
  post: function({ url, data = {}, options = {}, axiosOptions = {} }) {
    const headers = {
      ...(axiosOptions.headers || {}),
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const newAxiosOptions = {
      ...axiosOptions,
      method: 'post',
      headers,
      data: serialize(data)
    };
    return requestfactory(url, newAxiosOptions, options);
  },
  postJson: function({ url, data = {}, options = {}, axiosOptions = {} }) {
    const headers = {
      ...(axiosOptions.headers || {}),
      'Content-Type': 'application/json'
    };
    const newAxiosOptions = {
      ...axiosOptions,
      method: 'post',
      headers,
      data
    };
    return requestfactory(url, newAxiosOptions, options);
  },
  postForm: function({ url, data = {}, options = {}, axiosOptions = {} }) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    const headers = {
      ...(axiosOptions.headers || {}),
      'Content-Type': 'multipart/form-data'
    };
    const newAxiosOptions = {
      ...axiosOptions,
      method: 'post',
      headers,
      data: formData
    };
    return requestfactory(url, newAxiosOptions, options);
  },
  request: function({ url, method = 'get', data = {}, options = {}, axiosOptions = {} }) {
    // 先暂时只支持get和post
    if (method.toLowerCase() === 'get') {
      return this.get({ url, data, options, axiosOptions });
    } else {
      const { headers = {} } = axiosOptions;
      const contentType = headers['Content-Type'];
      if (contentType && contentType.toLowerCase() === 'application/json') {
        return this.postJson({ url, data, options, axiosOptions });
      } else if (contentType && contentType.toLowerCase() === 'multipart/form-data') {
        return this.postForm({ url, data, options, axiosOptions });
      } else {
        return this.post({ url, data, options, axiosOptions });
      }
    }
  }
};

// import { ASYNC_START, "ASYNC_END" } from 'constants';

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export const promiseMiddleware = store => next => (action) => {
  if (isPromise(action.payload)) {
    // 如果是Promise先发送一个异步开始动作
    store.dispatch({ type: 'ASYNC_START', subtype: action.type });
    action.payload
      .then((res) => {
        // console.log('RESULT', res);
        action.payload = res;
        store.dispatch({ type: 'ASYNC_END', subtype: action.type });
        store.dispatch(action);
      })
      .catch((error) => {
        // console.log('ERROR', error);
        action.error = true;
        action.payload = error;
        store.dispatch({ type: 'ASYNC_END', subtype: action.type, error: true });
        store.dispatch(action);
      });
  } else {
    next(action);
  }
};

import defaultState from 'redux/defaultState';

export default (state = defaultState.app, action) => {
  if (action.type === 'APP_LOADED') {
    // app启动
    return {
      ...state,
      appLoaded: true
    };
  }

  return state;
};

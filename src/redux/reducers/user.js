import defaultState from 'redux/defaultState';

export default (state = defaultState.user, action) => {
  if (action.type === 'USER_UPDATE') {
    // app加载
    return {
      ...action.payload
    };
  }

  if (action.type === 'USER_SIGNOUT') {
    // 退出登录 清空token和currentUser
    return defaultState.user;
  }

  return state;
};

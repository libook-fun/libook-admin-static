import defaultState from 'redux/defaultState';

export default (state = defaultState.ui, action) => {
  if (action.type === 'UI_LOADING') {
    // 异步开始
    return {
      ...state,
      loading: action.payload
    };
  }

  return state;
};

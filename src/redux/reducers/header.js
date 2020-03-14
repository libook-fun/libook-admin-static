import defaultState from 'redux/defaultState';

export default (state = defaultState.header, action) => {
  if (action.type === 'PAGE_LOAD') {
    return {
      ...state,
      ...action.payload
    };
  }

  return state;
};

import defaultState from 'redux/defaultState';

export default (state = defaultState.data, action) => {
  if (action.type === 'DATA_UPDATE') {
    return {
      ...state,
      ...action.payload
    };
  }

  if (action.type === 'DATA_REPLACE') {
    return {
      ...action.payload
    };
  }

  if (action.type === 'DATA_CLEAR') {
    return {};
  }

  return state;
};

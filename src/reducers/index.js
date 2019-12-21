import * as types from '../actions/types';

const createReducer = handlers => (state, action) => {
  if (!handlers.hasOwnProperty(action.type)) {
    return state;
  }

  return handlers[action.type](state, action);
};

const setUserProfile = (state, { payload }) => ({
  ...state,
  userProfile: payload.userProfile
});

const resetUserProfile = (state) => ({
  ...state,
  userProfile: null
});

export default createReducer({
  [types.SET_USER_PROFILE]: setUserProfile,
  [types.RESET_USER_PROFILE]: resetUserProfile,
});

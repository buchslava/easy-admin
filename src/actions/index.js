import * as types from './types';

export const setUserProfile = userProfile => ({ type: types.SET_USER_PROFILE, payload: { userProfile } });
export const resetUserProfile = () => ({ type: types.RESET_USER_PROFILE });

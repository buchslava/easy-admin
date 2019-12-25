import * as types from './types';

export const setUserProfile = userProfile => ({ type: types.SET_USER_PROFILE, payload: { userProfile } });
export const resetUserProfile = () => ({ type: types.RESET_USER_PROFILE });
export const setCurrentScreen = screenId => ({ type: types.SET_CURRENT_SCREEN, payload: { screenId } });
export const setConfig = config => ({ type: types.SET_CONFIG, payload: { config } });

import {createSlice} from '@reduxjs/toolkit';
import {ErrorType, FETCH_STATUS, FetchStatusValues} from '../../custom-config';
import {
  apiBaseUrl,
  createCustomAsyncThunk,
  facebookLogin,
  googleLogin,
  nativeFetch,
  storableError,
} from '../../utill';
import {
  resetCurrentUserOnLogout,
  selectCSRFToken,
  selectCurrentUser,
} from '../../globalReducers/userSlice';
import {AppSelectorType, RootStateType} from '../../../store';
import {ScreenValue, screenNames} from '../screenTypes';

const USER_LOG_OUT = 'app/profile/USER_LOG_OUT';

type ProfileStateType = {
  logoutStatus: FetchStatusValues;
  logoutError: ErrorType | null;
};

const initialState: ProfileStateType = {
  logoutStatus: FETCH_STATUS.idle,
  logoutError: null,
};

export const redirectOnLogoutSuccess = (
  selector: AppSelectorType,
  routeName?: ScreenValue,
) => {
  const redirectOptions = {pathName: screenNames.home, isRepalce: true};
  const logoutStatus = selector(selectLogoutStatus);

  return {
    redirectCondition: logoutStatus === FETCH_STATUS.succeeded,
    redirectOptions,
  };
};

export const selectLogoutStatus = (state: RootStateType) =>
  state.profile.logoutStatus;
export const selectLogoutError = (state: RootStateType) =>
  state.profile.logoutError;

export const logOut = createCustomAsyncThunk(
  USER_LOG_OUT,
  async (_, {getState, dispatch}) => {
    const state = getState();
    const url = `${apiBaseUrl()}/api/user/logout`;
    const csrfToken = selectCSRFToken(state) ?? '';
    const currrentUser = selectCurrentUser(state);
    const resp = await nativeFetch.get(url, {
      credentials: true,
      csrfToken,
    });
    if (currrentUser?.privateData.isThirdPartyLogin) {
      if (currrentUser.privateData.thirdPartyProvider === 'google') {
        await googleLogin.logout();
      } else if (currrentUser.privateData.thirdPartyProvider === 'facebook') {
        await facebookLogin.logout();
      }
    }
    dispatch(resetCurrentUserOnLogout());

    return resp.data;
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetLogoutStatus: state => {
      state.logoutStatus = FETCH_STATUS.idle;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(logOut.pending, state => {
        state.logoutStatus = FETCH_STATUS.loading;
        state.logoutError = null;
      })
      .addCase(logOut.fulfilled, state => {
        state.logoutStatus = FETCH_STATUS.succeeded;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.logoutError = storableError(action.payload);
        state.logoutStatus = FETCH_STATUS.failed;
      });
  },
});

export const {resetLogoutStatus} = profileSlice.actions;
export default profileSlice.reducer;

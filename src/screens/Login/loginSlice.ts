import {createSlice} from '@reduxjs/toolkit';
import {
  apiBaseUrl,
  createCustomAsyncThunk,
  nativeFetch,
  storableError,
} from '../../utill';
import {ErrorType, FETCH_STATUS, FetchStatusValues} from '../../custom-config';
import {AppDispatchType, RootStateType} from '../../../store';
import {
  addCSRFToken,
  fetchCurrentUser,
  updateAuthenticationStatus,
} from '../../globalReducers/userSlice';

type LoginStateType = {
  loginStatus: FetchStatusValues;
  loginError: ErrorType;
  loginDetails: {email?: string; password?: string};
};

const LOGIN_THUNK = 'app/LoginScreen/LOGIN_THUNK';
const GOOGLE_LOGIN_THUNK = 'app/LoginScreen/GOOGLE_LOGIN_THUNK';

const initialState: LoginStateType = {
  loginStatus: FETCH_STATUS.idle,
  loginError: null,
  loginDetails: {},
};

export const userLogin = createCustomAsyncThunk(
  LOGIN_THUNK,
  async (arg: {email?: string; password?: string}, {dispatch}) => {
    const {email, password} = arg;
    if (!email || !password) {
      return;
    }
    const url = `${apiBaseUrl()}/api/user/login`;
    const requestBody = {email, password};
    const resp = await nativeFetch.post(url, {body: requestBody});
    const csrfToken = resp.data.csrfToken;
    dispatch(addCSRFToken(csrfToken));
    dispatch(updateAuthenticationStatus(true));
    dispatch(fetchCurrentUser());
    return resp.data;
  },
);

export const googleUserLogin = async (
  googleIdToken: string | null,
  dispatch: AppDispatchType,
) => {
  if (googleIdToken === null) {
    throw new Error('googleIdToken cannot be null.');
  }
  const url = `${apiBaseUrl()}/api/user/app/google-login`;
  const data = {idToken: googleIdToken};
  const resp = await nativeFetch.post(url, {body: data});
  const {csrfToken} = resp.data;
  dispatch(addCSRFToken(csrfToken));
  await dispatch(fetchCurrentUser());
  return resp.data;
};

const loginSlice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(userLogin.pending, (state, action) => {
        state.loginStatus = FETCH_STATUS.loading;
        state.loginError = null;
        state.loginDetails = action.meta.arg;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loginStatus = FETCH_STATUS.succeeded;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loginStatus = FETCH_STATUS.failed;
        state.loginError = storableError(action.payload);
      });
  },
});

export const selectLoginStatus = (state: RootStateType) =>
  state.login.loginStatus;
export const selectLoginErr = (state: RootStateType) => state.login.loginError;
export const selectLoginDetails = (state: RootStateType) =>
  state.login.loginDetails;

export default loginSlice.reducer;

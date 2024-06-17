import {createSlice} from '@reduxjs/toolkit';
import {AppDispatchType, RootStateType} from '../../store';
import {
  ErrorType,
  FETCH_STATUS,
  FetchStatusValues,
  CurrentUserType,
} from '../custom-config';
import {
  apiBaseUrl,
  createCustomAsyncThunk,
  nativeFetch,
  storableError,
} from '../utill';

const FETCH_CURRENT_USER = 'app/user/FETCH_CURRENT_USER';
const FETCH_CSRF_TOKEN = 'app/user/FETCH_CSRF_TOKEN';

type UserStateType = {
  isAuthenticated: boolean;
  currentUser: CurrentUserType | null;
  currentUserFetchStatus: FetchStatusValues;
  currentUserFetchError: null | ErrorType;
  csrfToken: string | null;
  csrfTokenFetchStatus: FetchStatusValues;
};

const initialState: UserStateType = {
  isAuthenticated: false,
  currentUser: null,
  csrfToken: null,
  csrfTokenFetchStatus: FETCH_STATUS.idle,
  currentUserFetchStatus: FETCH_STATUS.idle,
  currentUserFetchError: null,
};

//============================== State getter =============================//
export const selectIsAuthenticated = (state: RootStateType) =>
  state.user.isAuthenticated;
export const selectCSRFToken = (state: RootStateType) => state.user.csrfToken;
export const selectCurrentUser = (state: RootStateType) =>
  state.user.currentUser;
export const selectCurrentUserFetchStatus = (state: RootStateType) =>
  state.user.currentUserFetchStatus;
export const selectCurrentUserFetchError = (state: RootStateType) =>
  state.user.currentUserFetchError;

// ==================================== Thunk =================================
export const fetchCsrfToken = createCustomAsyncThunk<string>(
  FETCH_CSRF_TOKEN,
  async () => {
    const url = `${apiBaseUrl()}/api/user/csrftoken`;
    const resp = await nativeFetch.get(url, {credentials: true});
    return resp.data.csrfToken;
  },
);

export const fetchCurrentUser = createCustomAsyncThunk<CurrentUserType>(
  FETCH_CURRENT_USER,
  async (_, {getState, dispatch}) => {
    const url = `${apiBaseUrl()}/api/user/current-user`;
    const csrfToken = await getCurrentUserCSRFToken(dispatch, getState);
    const resp = await nativeFetch.get(url, {
      csrfToken,
      credentials: true,
    });
    return resp.data;
  },
);

//============================= Helpers =============================//

export const getCurrentUserCSRFToken = async (
  dispatch: AppDispatchType,
  getState: () => RootStateType,
) => {
  const state = getState();
  let csrfToken = selectCSRFToken(state);
  if (!csrfToken) {
    await dispatch(fetchCsrfToken());
    csrfToken = selectCSRFToken(getState()) ?? '';
  }
  return csrfToken;
};

//====================== Reducer================================

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addCSRFToken: (state, action) => {
      const {payload} = action;
      state.csrfToken = payload;
    },
    updateAuthenticationStatus: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    resetCurrentUserOnLogout: state => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCurrentUser.pending, (state, action) => {
        state.currentUserFetchStatus = FETCH_STATUS.loading;
        state.currentUserFetchError = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUserFetchStatus = FETCH_STATUS.succeeded;
        state.currentUser = action.payload as CurrentUserType;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.currentUserFetchStatus = FETCH_STATUS.failed;
        state.currentUserFetchError = storableError(action.payload);
      })
      .addCase(fetchCsrfToken.pending, state => {
        state.csrfTokenFetchStatus = FETCH_STATUS.loading;
        state.csrfToken = null;
      })
      .addCase(fetchCsrfToken.fulfilled, (state, action) => {
        state.csrfTokenFetchStatus = FETCH_STATUS.succeeded;
        state.csrfToken = action.payload as string;
      })
      .addCase(fetchCsrfToken.rejected, (state, action) => {
        state.csrfTokenFetchStatus = FETCH_STATUS.failed;
      });
  },
});

export default userSlice.reducer;

//======================= Action creators =========================
export const {
  addCSRFToken,
  updateAuthenticationStatus,
  resetCurrentUserOnLogout,
} = userSlice.actions;

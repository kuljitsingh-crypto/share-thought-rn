import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  apiBaseUrl,
  createCustomAsyncThunk,
  nativeFetch,
  storableError,
} from '../../utill';
import {RootStateType} from '../../../store';
import {ErrorType, FETCH_STATUS, FetchStatusValues} from '../../custom-config';
import {addCSRFToken} from '../../globalReducers/userSlice';

const RESET_PASSWORD = 'app/ResetPassword/RESET_PASSWORD';

type ResetPasswordState = {
  token: string;
  email: string;
  passwordUpdatedStatus: FetchStatusValues;
  passwordUpdatedError: ErrorType | null;
};
const initialState: ResetPasswordState = {
  token: '',
  email: '',
  passwordUpdatedError: null,
  passwordUpdatedStatus: FETCH_STATUS.idle,
};

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState,
  reducers: {
    updateResetPasswordTokenAndEmail: (
      state,
      action: PayloadAction<{token: string; email: string}>,
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    resetResetPasswordState: state => {
      state.token = '';
      state.email = '';
      state.passwordUpdatedStatus = FETCH_STATUS.idle;
      state.passwordUpdatedError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(resetUserPassword.pending, (state, action) => {
        state.passwordUpdatedStatus = FETCH_STATUS.loading;
        state.passwordUpdatedError = null;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.passwordUpdatedStatus = FETCH_STATUS.succeeded;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.passwordUpdatedStatus = FETCH_STATUS.failed;
        state.passwordUpdatedError = storableError(action.payload);
      });
  },
});

export const {updateResetPasswordTokenAndEmail, resetResetPasswordState} =
  resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;

const selectTokenEmail = (state: RootStateType) => ({
  token: state.resetPassword.token,
  email: state.resetPassword.email,
});

export const selectPasswordResetStatus = (state: RootStateType) =>
  state.resetPassword.passwordUpdatedStatus;

export const selectPasswordResetError = (state: RootStateType) =>
  state.resetPassword.passwordUpdatedError;

export const resetUserPassword = createCustomAsyncThunk(
  RESET_PASSWORD,
  async (password: string, {getState}) => {
    const {token, email} = selectTokenEmail(getState());
    const data = {token, auth: email, newPassword: password};
    const url = `${apiBaseUrl()}/api/user/reset-password`;
    const resp = await nativeFetch.post(url, {body: data});
    const {csrfToken} = resp.data;
    addCSRFToken(csrfToken);
    return 'ok';
  },
);

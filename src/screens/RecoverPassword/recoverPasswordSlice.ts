import {createSlice} from '@reduxjs/toolkit';
import {ErrorType, FETCH_STATUS, FetchStatusValues} from '../../custom-config';
import {
  apiBaseUrl,
  createCustomAsyncThunk,
  nativeFetch,
  storableError,
} from '../../utill';
import {RootStateType} from '../../../store';

const resetPasswordToken = 'app/RECOVER_PASSWORD/GENERATE_RESET_PASSWORD_TOKEN';

type RecoverPasswordState = {
  tokenGenerationStaus: FetchStatusValues;
  tokenGenerationError: null | ErrorType;
  tokenEmail: string;
};
const initialState: RecoverPasswordState = {
  tokenGenerationError: null,
  tokenGenerationStaus: FETCH_STATUS.idle,
  tokenEmail: '',
};

export const selectTokenStatus = (state: RootStateType) =>
  state.recoverPassword.tokenGenerationStaus;
export const selectTokenError = (state: RootStateType) =>
  state.recoverPassword.tokenGenerationError;

export const selectTokenEmail = (state: RootStateType) =>
  state.recoverPassword.tokenEmail;

//====================================== Async Thunk===========================//
export const generateResetPasswordToken = createCustomAsyncThunk(
  resetPasswordToken,
  async (email: string) => {
    const url = `${apiBaseUrl()}/api/user/recover-password`;
    const resp = await nativeFetch.post(url, {body: {auth: email}});
    return resp.data;
  },
);

const recoverPasswordSlice = createSlice({
  name: 'recoverPassword',
  initialState,
  reducers: {
    resetRecoverPasswordState: state => {
      state.tokenEmail = '';
      state.tokenGenerationError = null;
      state.tokenGenerationStaus = FETCH_STATUS.idle;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(generateResetPasswordToken.pending, (state, action) => {
        state.tokenGenerationStaus = FETCH_STATUS.loading;
        state.tokenGenerationError = null;
      })
      .addCase(generateResetPasswordToken.fulfilled, (state, action) => {
        state.tokenGenerationStaus = FETCH_STATUS.succeeded;
        state.tokenEmail = action.meta.arg;
      })
      .addCase(generateResetPasswordToken.rejected, (state, action) => {
        state.tokenGenerationStaus = FETCH_STATUS.failed;
        state.tokenGenerationError = storableError(action.payload);
      });
  },
});

export default recoverPasswordSlice.reducer;
export const {resetRecoverPasswordState} = recoverPasswordSlice.actions;

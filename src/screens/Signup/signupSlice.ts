import {createSlice} from '@reduxjs/toolkit';
import {ErrorType, FETCH_STATUS, FetchStatusValues} from '../../custom-config';
import {
  apiBaseUrl,
  createCustomAsyncThunk,
  nativeFetch,
  storableError,
} from '../../utill';
import {RootStateType} from '../../../store';
import {userLogin} from '../Login/loginSlice';

type SignupStateType = {
  signupStatus: FetchStatusValues;
  signupError: ErrorType | null;
};

const USER_SIGNUP = 'app/signup/signup';
const initialState: SignupStateType = {
  signupStatus: FETCH_STATUS.idle,
  signupError: null,
};

export const userSignup = createCustomAsyncThunk(
  USER_SIGNUP,
  async (
    arg: {
      email?: string;
      password?: string;
      lastName?: string;
      firstName?: string;
    },
    {dispatch},
  ) => {
    const {email, password, lastName, firstName} = arg;
    const hasData = email && password && lastName && firstName;
    if (!hasData) return null;
    const url = `${apiBaseUrl()}/api/user/signup`;
    const resp = await nativeFetch.post(url, {
      body: {email, password, publicData: {firstName, lastName}},
    });
    await dispatch(userLogin({email, password}));
    return resp.data;
  },
);

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(userSignup.pending, (state, action) => {
        state.signupStatus = FETCH_STATUS.loading;
        state.signupError = null;
      })
      .addCase(userSignup.fulfilled, (state, action) => {
        state.signupStatus = FETCH_STATUS.succeeded;
      })
      .addCase(userSignup.rejected, (state, action) => {
        state.signupStatus = FETCH_STATUS.failed;
        state.signupError = storableError(action.payload);
      });
  },
});

export const selectSignupStatus = (state: RootStateType) =>
  state.signup.signupStatus;
export const selectSignupError = (state: RootStateType) =>
  state.signup.signupError;

export default signupSlice.reducer;

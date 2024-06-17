import homeReducer from './Home/homeSlice';
import loginReducer from './Login/loginSlice';
import signupReducer from './Signup/signupSlice';
import profileReducer from './Profile/profileSlice';
import recoverPasswordSliceReducer from './RecoverPassword/recoverPasswordSlice';
import resetPasswordSliceReducer from './ResetPassword/resetPasswordSlice';

export const reducer = {
  home: homeReducer,
  login: loginReducer,
  signup: signupReducer,
  profile: profileReducer,
  recoverPassword: recoverPasswordSliceReducer,
  resetPassword: resetPasswordSliceReducer,
};

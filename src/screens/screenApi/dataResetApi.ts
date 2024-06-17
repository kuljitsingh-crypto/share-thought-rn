import {resetLogoutStatus} from '../Profile/profileSlice';
import {resetRecoverPasswordState} from '../RecoverPassword/recoverPasswordSlice';
import {resetResetPasswordState} from '../ResetPassword/resetPasswordSlice';
import {screenNames} from '../screenTypes';

export const resetReduxState = {
  [screenNames.resetPassword]: resetResetPasswordState,
  [screenNames.recoverPassword]: resetRecoverPasswordState,
  [screenNames.profile]: resetLogoutStatus,
};

export type ResetReduxState =
  (typeof resetReduxState)[keyof typeof resetReduxState];

export type ResetReduxStatekey = keyof typeof resetReduxState;

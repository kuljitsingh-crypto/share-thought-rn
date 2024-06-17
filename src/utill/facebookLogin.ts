import {LoginManager, AccessToken, Settings} from 'react-native-fbsdk-next';
import {config} from './config';

const PERMISSIONS = ['public_profile', 'email'];
const facebookId = config.FACEBOOK_CLIENT_ID;

export const FacebookSignInError = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  IN_PROGRESS: 'IN_PROGRESS',
  PERMISSIONS_DECLINED: 'PERMISSIONS_DECLINED',
  OTHER: 'OTHER',
} as const;

const facebookSignInErrorTitleAndMessage = {
  [FacebookSignInError.SIGN_IN_CANCELLED]: {
    title: 'Facebook Sign-In Cancelled',
    message: 'You have canceled the sign-in process.',
  },
  [FacebookSignInError.IN_PROGRESS]: {
    title: 'Facebook Sign-In In Progress',
    message:
      'The sign-in process with your Facebook account is currently ongoing. Please wait before trying again.',
  },
  [FacebookSignInError.PERMISSIONS_DECLINED]: {
    title: 'Facebook Sign-In Permission Declined',
    message:
      'Some permissions required for the sign-in process were declined. Please accept all permissions to proceed.',
  },
  [FacebookSignInError.OTHER]: {
    title: 'Facebook Sign-In/Sign-Out Failed',
    message:
      'An unknown error occurred during the Facebook sign-in or sign-out process. Please try again later.',
  },
};

type FacebookSignInErrorValue =
  (typeof FacebookSignInError)[keyof typeof FacebookSignInError];

export type FacebookLoginAccesToken = AccessToken;
export type FacebookLoginError = {
  errorCode: FacebookSignInErrorValue;
  title: string;
  message: string;
  nativeError: any;
};

class FacebookLogin {
  static #instance: FacebookLogin | null = null;
  static #facebokAppId = facebookId;
  #hasFacebookId =
    !!FacebookLogin.#facebokAppId &&
    typeof FacebookLogin.#facebokAppId === 'string';
  constructor() {
    if (FacebookLogin.#instance === null) {
      FacebookLogin.#instance = this;
      this.#initialize();
    }
    return FacebookLogin.#instance;
  }

  #initialize() {
    if (this.#hasFacebookId) {
      Settings.initializeSDK();
    }
  }

  get hasFacebookId(): boolean {
    return this.#hasFacebookId;
  }

  async login(options: {
    onError: (errOptions: FacebookLoginError) => void;
    onSuccess: (accessToken: FacebookLoginAccesToken) => void;
    throwErrorOnNoId?: boolean;
  }) {
    const {onError, onSuccess, throwErrorOnNoId} = options;
    if (!this.#hasFacebookId) {
      if (throwErrorOnNoId) {
        throw new Error(
          'FACEBOOK_CLIENT_ID needs to be string but found undefined.',
        );
      }
      return;
    }
    try {
      const logInResponse = await LoginManager.logInWithPermissions(
        PERMISSIONS,
      );
      if (logInResponse.isCancelled) {
        onError({
          errorCode: FacebookSignInError.SIGN_IN_CANCELLED,
          ...facebookSignInErrorTitleAndMessage[
            FacebookSignInError.SIGN_IN_CANCELLED
          ],
          nativeError: null,
        });
        return;
      }
      if (
        logInResponse.declinedPermissions &&
        Array.isArray(logInResponse.declinedPermissions) &&
        logInResponse.declinedPermissions.length > 0
      ) {
        onError({
          errorCode: FacebookSignInError.PERMISSIONS_DECLINED,
          ...facebookSignInErrorTitleAndMessage[
            FacebookSignInError.PERMISSIONS_DECLINED
          ],
          nativeError: null,
        });
        return;
      }
      const accessTokenObject = await AccessToken.getCurrentAccessToken();
      if (accessTokenObject === null) {
        onError({
          errorCode: FacebookSignInError.IN_PROGRESS,
          ...facebookSignInErrorTitleAndMessage[
            FacebookSignInError.IN_PROGRESS
          ],
          nativeError: null,
        });
        return;
      }
      onSuccess(accessTokenObject);
    } catch (error) {
      onError({
        errorCode: FacebookSignInError.OTHER,
        ...facebookSignInErrorTitleAndMessage[FacebookSignInError.OTHER],
        nativeError: error,
      });
      return;
    }
  }

  async logout(options?: {
    onError?: (errOptions: FacebookLoginError) => void;
    onSuccess?: (isLogout: boolean) => void;
    throwErrorOnNoId?: boolean;
  }) {
    const {onError, onSuccess, throwErrorOnNoId} = options || {};
    if (!this.#hasFacebookId) {
      if (throwErrorOnNoId) {
        throw new Error(
          'FACEBOOK_CLIENT_ID needs to be string but found undefined.',
        );
      }
      return;
    }
    try {
      await LoginManager.logOut();
      if (typeof onSuccess === 'function') {
        onSuccess(true);
      }
    } catch (error) {
      if (typeof onError === 'function') {
        onError({
          errorCode: FacebookSignInError.OTHER,
          nativeError: error,
          ...facebookSignInErrorTitleAndMessage[FacebookSignInError.OTHER],
        });
      }
    }
  }
}

const facebookLoginObject = new FacebookLogin();
Object.freeze(facebookLoginObject);
export const facebookLogin = facebookLoginObject;

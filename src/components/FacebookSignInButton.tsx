import {Linking, Modal, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {SecondaryButton} from './Button';
import {apiBaseUrl, colors, config, nativeFetch} from '../utill';
import {normalFont} from '../styles/appDefaultStyle';
import Icon from './Icon';
import {authorize} from 'react-native-app-auth';

type FacebookSignInProps = {
  loginText: string;
};

const facebookId = config.FACEBOOK_CLIENT_ID as string;
const facebookLoginBaseUrl = config.FACEBOOK_LOGIN_API_URL;
const hasFacebookId = facebookId && typeof facebookId === 'string';

const loginUrl = `${
  facebookLoginBaseUrl || apiBaseUrl()
}/api/user/facebook-login/callback`;
const facebookConfig = {
  clientId: facebookId,
  redirectUrl: loginUrl,
  scopes: ['public_profile', 'email'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.facebook.com/v12.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v12.0/oauth/access_token',
  },
};

const FacebookSignInButton = (props: FacebookSignInProps) => {
  const {loginText} = props;
  const buttonTextStyleMaybe = {style: styles.socialBtnText};
  const buttonStyleMaybe = {style: styles.socialBtn};
  const [url, setUrl] = useState('');

  const loginWithFacebook = async () => {
    try {
      const result = await authorize(facebookConfig);
      console.log('Access Token:', result.accessToken);
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  const handleFacebookLogin = async () => {
    // const resp = await nativeFetch.get(loginUrl);
    // const data = resp.data;
    // console.log(data);
    // const redirectPath = `${apiBaseUrl()}/facebook-login`;
    loginWithFacebook();

    // setUrl(url);
    // Linking.openURL(url);
  };
  return hasFacebookId ? (
    <React.Fragment>
      <SecondaryButton {...buttonStyleMaybe} onPress={handleFacebookLogin}>
        <Icon
          name="logo-facebook"
          iconType="ionicons"
          color={colors.primaryDark}
        />
        <Text {...buttonTextStyleMaybe}>{loginText}</Text>
      </SecondaryButton>
    </React.Fragment>
  ) : (
    <Text style={styles.inActiveGoogleSignIn}>
      To Enable Facebook Sign in. Add FACEBOOK_CLIENT_ID ,
      FACEBOOK_LOGIN_API_URL (add FACEBOOK_LOGIN_API_URL only during dvelopment
      which is http://localhost:3500 or local development server) in your .env ,
      and build your app once again.
    </Text>
  );
};

export default FacebookSignInButton;

const styles = StyleSheet.create({
  socialBtn: {
    flexDirection: 'row',
    gap: 12,
    borderColor: colors.primaryDark,
  },
  socialBtnText: {
    color: colors.primaryDark,
    ...normalFont,
  },
  inActiveGoogleSignIn: {
    color: colors.black,
    paddingVertical: 4,
  },
});

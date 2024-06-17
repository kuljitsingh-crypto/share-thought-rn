import {Linking, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Field, ReactNativeForm, validators} from 'native-form';
import {useConnect, useIntl, useRedirectOnCurrentUserLoaded} from '../../hooks';
import {container, headerText, normalFont} from '../../styles/appDefaultStyle';
import {
  ErrorView,
  FacebookSignInButton,
  FormatedMessage,
  Icon,
  InlineTextButton,
  PrimaryButton,
  SecondaryButton,
} from '../../components';
import {GoogleLoginUser, apiBaseUrl, colors, fonts} from '../../utill';
import {
  googleUserLogin,
  selectLoginDetails,
  selectLoginErr,
  selectLoginStatus,
  userLogin,
} from './loginSlice';
import {AppDispatchType, AppSelectorType} from '../../../store';
import {FETCH_STATUS} from '../../custom-config';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {selectCurrentUserFetchError} from '../../globalReducers/userSlice';
import {ScreenParamList, screenNames} from '../screenTypes';
import GoogleSignInButton from '../../components/GoogleSignInButton';
const {composeValidators, required, emailFormatValid} = validators;

const REDIRECT_MSG =
  'User with given email does not exists. Please sign up with given email.';

const mapStateToProps = (selector: AppSelectorType) => {
  const loginStatus = selector(selectLoginStatus);
  const loginErr = selector(selectLoginErr);
  const loginDetails = selector(selectLoginDetails);
  const currentUserFetchError = selector(selectCurrentUserFetchError);
  return {
    loginStatus,
    loginErr,
    loginDetails,
    currentUserFetchError,
  };
};

const mapDispatchToProps = (dispatch: AppDispatchType) => ({
  onUserLogin: (params: {email?: string; password?: string}) =>
    dispatch(userLogin(params)),
  onGoogleUserLogin: (token: string | null) => googleUserLogin(token, dispatch),
});

type LoginProps = NativeStackScreenProps<ScreenParamList, 'login'>;
const Login = (props: LoginProps) => {
  const {navigation} = props;
  const intl = useIntl();
  const {
    loginStatus,
    loginErr,
    currentUserFetchError,
    loginDetails,
    onUserLogin,
    onGoogleUserLogin,
  } = useConnect(mapStateToProps, mapDispatchToProps);

  const handleOnSubmit = async (values: any) => {
    onUserLogin(values);
  };

  const handleForgotPwd = () => {
    navigation.navigate(screenNames.recoverPassword);
  };

  const handleGoogleLogin = async (user: GoogleLoginUser) => {
    await onGoogleUserLogin(user.idToken);
    navigation.navigate(screenNames.home);
  };

  useEffect(() => {
    if (loginErr?.data === REDIRECT_MSG) {
      navigation.navigate(screenNames.signUp, {
        email: '',
        password: '',
        ...loginDetails,
      });
    }
  }, [loginErr]);

  useRedirectOnCurrentUserLoaded(screenNames.home);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={headerText}>{intl.formatMessage('Login.title')}</Text>
      <ReactNativeForm
        submitError={loginErr || currentUserFetchError}
        submitting={loginStatus === FETCH_STATUS.loading}
        onSubmit={handleOnSubmit}
        onRender={formRenderProps => {
          const {onSubmit, invalid, submitting, submitError} = formRenderProps;
          const submitDisabled = invalid;
          const emailPlaceholder = intl.formatMessage('Login.emailPlaceholder');
          const passwordPlaceholder = intl.formatMessage(
            'Login.pwdPlaceholder',
          );
          const emailRequired = intl.formatMessage('Login.emailRequired');
          const invalidEmail = intl.formatMessage('Login.emailInvalid');
          const emailValidator = composeValidators(
            required(emailRequired),
            emailFormatValid(invalidEmail),
          );

          const pwdRequired = intl.formatMessage('Login.pwdRequired');
          return (
            <View style={styles.formContainer}>
              <Field
                name="email"
                type="email"
                placeholder={emailPlaceholder}
                validate={emailValidator}
                textStyle={styles.blackColorText}
              />
              <Field
                name="password"
                type="password"
                placeholder={passwordPlaceholder}
                validate={required(pwdRequired)}
                enableTogglePasswordOption={true}
                textStyle={styles.blackColorText}
              />
              <InlineTextButton
                style={styles.forgotPwd}
                onPress={handleForgotPwd}>
                <FormatedMessage
                  id="Login.forgotPassword"
                  style={styles.forgotPwdText}
                />
              </InlineTextButton>
              {loginStatus === FETCH_STATUS.failed &&
              submitError?.data !== REDIRECT_MSG ? (
                <ErrorView
                  text={submitError?.data}
                  viewStyle={{paddingBottom: 0, paddingTop: 0}}
                />
              ) : null}
              <PrimaryButton
                onPress={onSubmit}
                disabled={submitDisabled}
                inProgress={submitting}>
                <FormatedMessage
                  id="Login.continueBtn"
                  style={styles.loginBtnText}
                />
              </PrimaryButton>
            </View>
          );
        }}
      />
      <View style={styles.divider}>
        <View style={styles.dividerLine}></View>
        <FormatedMessage id="Login.orSeparator" style={styles.orSep} />
      </View>
      {/* <SecondaryButton style={styles.socialBtn} onPress={openGoogleLoginModal}>
        <Icon name="google" iconType="ant" color={colors.primaryDark} />
        <FormatedMessage
          id={'Login.continueWithGoogle'}
          style={styles.socialBtnText}
        />
      </SecondaryButton>
      <SecondaryButton style={styles.socialBtn}>
        <Icon
         
          color={colors.primaryDark}
        />
        <FormatedMessage
          id={'Login.continueWithFacebook'}
          style={styles.socialBtnText}
        />
      </SecondaryButton> */}
      <GoogleSignInButton
        loginText={intl.formatMessage('Login.continueWithGoogle')}
        onSuccess={handleGoogleLogin}
      />
      <FacebookSignInButton
        loginText={intl.formatMessage('Login.continueWithFacebook')}
      />
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    ...container,
  },
  formContainer: {
    marginTop: 16,
  },
  loginBtnText: {
    color: colors.white,
    ...normalFont,
  },
  socialBtn: {
    flexDirection: 'row',
    gap: 12,
    borderColor: colors.primaryDark,
  },
  socialBtnText: {
    color: colors.primaryDark,
    ...normalFont,
  },
  divider: {
    height: 32,
    width: '100%',
    position: 'relative',
  },
  dividerLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: colors.matterColorNegative,
    top: 16,
  },
  orSep: {
    position: 'absolute',
    backgroundColor: colors.white,
    fontFamily: fonts.thin,
    padding: 2,
    paddingHorizontal: 8,
    top: 2,
    color: colors.matterColorAnti,
    left: '50%',
    transform: [{translateX: -20}],
    ...normalFont,
  },
  blackColorText: {
    color: colors.black,
  },
  forgotPwdText: {
    ...normalFont,
    color: colors.primaryDark,
  },
  forgotPwd: {
    paddingVertical: 6,
  },
});

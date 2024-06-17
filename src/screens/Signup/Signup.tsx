import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {container, headerText, normalFont} from '../../styles/appDefaultStyle';
import {ErrorView, FormatedMessage, PrimaryButton} from '../../components';
import {Field, ReactNativeForm, validators} from 'native-form';
import {
  useConnect,
  useCurrentUser,
  useIntl,
  useRedirectOnCurrentUserLoaded,
} from '../../hooks';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenParamList, screenNames} from '../screenTypes';
import {colors} from '../../utill';
import {AppDispatchType, AppSelectorType} from '../../../store';
import {selectSignupError, selectSignupStatus, userSignup} from './signupSlice';
import {FETCH_STATUS} from '../../custom-config';

const {composeValidators, required, emailFormatValid} = validators;

const mapStateToProps = (selector: AppSelectorType) => {
  return {
    signpStatus: selector(selectSignupStatus),
    signupError: selector(selectSignupError),
  };
};
const mapDispatchToProps = (dispatch: AppDispatchType) => ({
  onUserSignup: (arg: {
    email?: string;
    password?: string;
    lastName?: string;
    firstName?: string;
  }) => dispatch(userSignup(arg)),
});

type SignupProps = NativeStackScreenProps<ScreenParamList, 'signUp'>;
const Signup = (props: SignupProps) => {
  const {route} = props;
  const {email, password} = route.params;
  const intl = useIntl();
  const {signpStatus, signupError, onUserSignup} = useConnect(
    mapStateToProps,
    mapDispatchToProps,
  );
  const onSubmit = (values: any) => {
    onUserSignup(values);
  };

  useRedirectOnCurrentUserLoaded(screenNames.home);
  return (
    <ScrollView style={styles.container}>
      <FormatedMessage id="Signup.title" style={headerText} />
      <ReactNativeForm
        extra={{intl: intl}}
        initalValues={{email, password}}
        onSubmit={onSubmit}
        submitting={signpStatus === FETCH_STATUS.loading}
        submitError={signupError}
        onRender={formRenderProps => {
          const {
            extra: {intl},
            onSubmit,
            invalid,
            submitting,
            submitError,
          } = formRenderProps;
          const firstNamePlaceHolder = intl.formatMessage(
            'Signup.firstNamePlaceholder',
          );
          const lastNamePlaceHolder = intl.formatMessage(
            'Signup.lastNamePlaceholder',
          );
          const emailPlaceHolder = intl.formatMessage(
            'Signup.emailPlaceholder',
          );
          const passwordPlaceHolder = intl.formatMessage(
            'Signup.passwordPlaceholder',
          );
          const emailRequired = intl.formatMessage('Signup.emailRequired');
          const firstNameRequired = intl.formatMessage(
            'Signup.firstNameRequired',
          );
          const lastNameRequired = intl.formatMessage(
            'Signup.lastNameRequired',
          );
          const passwordRequired = intl.formatMessage('Signup.pwdRequired');
          const emailInvalid = intl.formatMessage('Signup.emailInvalid');
          return (
            <View>
              <Field
                type="text"
                name="firstName"
                placeholder={firstNamePlaceHolder}
                validate={required(firstNameRequired)}
              />
              <Field
                type="text"
                name="lastName"
                placeholder={lastNamePlaceHolder}
                validate={required(lastNameRequired)}
              />
              <Field
                type="email"
                name="email"
                placeholder={emailPlaceHolder}
                validate={composeValidators(
                  required(emailRequired),
                  emailFormatValid(emailInvalid),
                )}
              />
              <Field
                type="password"
                name="password"
                placeholder={passwordPlaceHolder}
                enableTogglePasswordOption={true}
                validate={required(passwordRequired)}
              />
              {submitError && submitError?.data ? (
                <ErrorView text={submitError.data} />
              ) : null}
              <PrimaryButton
                onPress={onSubmit}
                disabled={invalid}
                inProgress={submitting}>
                <FormatedMessage
                  id="Signup.submitBtn"
                  style={styles.signupBtnText}
                />
              </PrimaryButton>
            </View>
          );
        }}
      />
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    ...container,
    paddingTop: 0,
  },
  signupBtnText: {
    color: colors.white,
    ...normalFont,
  },
});

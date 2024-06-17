import {Linking, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {container, headerText, normalFont} from '../../styles/appDefaultStyle';
import {
  ErrorView,
  FormatedMessage,
  Icon,
  PrimaryButton,
} from '../../components';
import {colors} from '../../utill';
import {Field, ReactNativeForm, validators} from 'native-form';
import {useConnect, useIntl, useSucessHandler} from '../../hooks';
import {SimpleToast, useToast} from '../../SimpleToast';
import {AppDispatchType, AppSelectorType} from '../../../store';
import {
  generateResetPasswordToken,
  selectTokenEmail,
  selectTokenError,
  selectTokenStatus,
} from './recoverPasswordSlice';
import {FETCH_STATUS} from '../../custom-config';

const {emailFormatValid, required, composeValidators} = validators;

const mapStateToProps = (selector: AppSelectorType) => {
  return {
    tokenGenerationStatus: selector(selectTokenStatus),
    tokenGenerationError: selector(selectTokenError),
    tokenEmail: selector(selectTokenEmail),
  };
};

const mapDispatchToProps = (dispatch: AppDispatchType) => ({
  onGenerateToken: (email: string) =>
    dispatch(generateResetPasswordToken(email)),
});

const RecoverPassword = () => {
  const intl = useIntl();
  const toast = useToast();
  const {
    tokenGenerationStatus,
    tokenGenerationError,
    tokenEmail,
    onGenerateToken,
  } = useConnect(mapStateToProps, mapDispatchToProps);
  const emailSentTitle = intl.formatMessage('RecoverPassword.emailSent.title');
  const emailSentDesc = intl.formatMessage('RecoverPassword.emailSent.body', {
    email: tokenEmail,
  });

  const handleSubmit = (values: any) => {
    if (!values.email) return;
    onGenerateToken(values.email)
      .then(() => {})
      .catch(() => {});
  };

  useSucessHandler(
    tokenGenerationStatus,
    (title: string, desc: string) => {
      toast.show({title, desc});
    },
    emailSentTitle,
    emailSentDesc,
  );

  return (
    <View style={container}>
      <Icon
        iconType="material-community"
        name="account-key"
        size={64}
        color={colors.primary}
      />
      <FormatedMessage id="RecoverPassword.title" style={styles.title} />
      <FormatedMessage id="RecoverPassword.desc" style={styles.desc} />
      <ReactNativeForm
        extra={{intl, tokenGenerationStatus}}
        onSubmit={handleSubmit}
        submitting={tokenGenerationStatus === FETCH_STATUS.loading}
        submitError={tokenGenerationError}
        onRender={formProps => {
          const {
            invalid,
            onSubmit,
            submitting,
            submitError,
            extra: {intl},
          } = formProps;

          const emailPlaceholder = intl.formatMessage(
            'RecoverPassword.emailPlaceholder',
          );
          const emailFormatValidMsg = intl.formatMessage(
            'RecoverPassword.emailInvalid',
          );
          const emailRequired = intl.formatMessage(
            '"RecoverPassword.emailRequired',
          );
          return (
            <View style={styles.form}>
              <Field
                type="email"
                name="email"
                placeholder={emailPlaceholder}
                validate={composeValidators(
                  emailFormatValid(emailFormatValidMsg),
                  required(emailRequired),
                )}
              />
              {submitError ? (
                <ErrorView
                  text={submitError?.data}
                  viewStyle={{paddingBottom: 0, paddingTop: 0}}
                />
              ) : null}
              <PrimaryButton
                disabled={invalid}
                onPress={onSubmit}
                inProgress={submitting}>
                <FormatedMessage
                  id="RecoverPassword.sendBtn"
                  style={styles.submitBtn}
                />
              </PrimaryButton>
            </View>
          );
        }}
      />
    </View>
  );
};

export default RecoverPassword;

const styles = StyleSheet.create({
  title: {
    ...headerText,
    fontSize: 24,
    paddingVertical: 12,
  },
  desc: {
    ...normalFont,
    color: colors.black,
  },
  form: {
    paddingVertical: 16,
  },
  submitBtn: {...normalFont, color: colors.white},
});

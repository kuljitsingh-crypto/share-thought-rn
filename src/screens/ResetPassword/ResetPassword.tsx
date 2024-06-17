import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {container, headerText, normalFont} from '../../styles/appDefaultStyle';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenParamList, screenNames} from '../screenTypes';
import {
  ErrorView,
  FormatedMessage,
  Icon,
  InlineTextButton,
  PrimaryButton,
} from '../../components';
import {colors} from '../../utill';
import {Field, ReactNativeForm, validators} from 'native-form';
import {useConnect, useIntl, useSucessHandler} from '../../hooks';
import {AppDispatchType, AppSelectorType} from '../../../store';
import {
  resetUserPassword,
  selectPasswordResetError,
  selectPasswordResetStatus,
} from './resetPasswordSlice';
import {FETCH_STATUS} from '../../custom-config';

type ResetPasswordProps = NativeStackScreenProps<
  ScreenParamList,
  'resetPassword'
>;
const {composeValidators, required, compareTwoValues} = validators;
const mapStateToProps = (selector: AppSelectorType) => ({
  passwordResetStatus: selector(selectPasswordResetStatus),
  passwodResetError: selector(selectPasswordResetError),
});
const mapDispatchToProps = (dispatch: AppDispatchType) => ({
  onResetUserPassword: (password: string) =>
    dispatch(resetUserPassword(password)),
});

const ResetPasswordHeader = (props: {
  navigation: ResetPasswordProps['navigation'];
}) => {
  const {navigation} = props;
  const handleOnPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace(screenNames.home);
    }
  };
  return (
    <View style={styles.header}>
      <InlineTextButton onPress={handleOnPress} style={styles.backButton}>
        <Icon iconType="ionicons" name="arrow-back-sharp" />
      </InlineTextButton>
    </View>
  );
};

const ResetPassword = (props: ResetPasswordProps) => {
  const intl = useIntl();
  const {navigation} = props;
  const {passwodResetError, passwordResetStatus, onResetUserPassword} =
    useConnect(mapStateToProps, mapDispatchToProps);
  const handleSubmit = async (values: any) => {
    if (!values.password) return;
    onResetUserPassword(values.password);
  };

  useSucessHandler(passwordResetStatus, () => {
    navigation.navigate(screenNames.login);
  });

  return (
    <View style={styles.viewContainer}>
      <ResetPasswordHeader navigation={navigation} />
      <View style={styles.body}>
        <Icon
          iconType="material-community"
          name="shield-key"
          size={64}
          color={colors.primary}
        />
        <FormatedMessage id="ResetPassword.title" style={styles.title} />
        <ReactNativeForm
          extra={{intl}}
          onSubmit={handleSubmit}
          submitting={passwordResetStatus === FETCH_STATUS.loading}
          submitError={passwodResetError}
          onRender={formProps => {
            const {
              extra: {intl},
              invalid,
              values,
              onSubmit,
              submitError,
              submitting,
            } = formProps;
            const {password, confirmPassword} = values;
            const passwordRequired = intl.formatMessage(
              'ResetPassword.passwordRequired',
            );
            const confirmPasswordRequired = intl.formatMessage(
              'ResetPassword.confirmPasswordRequired',
            );
            const confirmPasswordNotEqualPassword = intl.formatMessage(
              'ResetPassword.confirmPasswordNotMatch',
            );
            const submitDisabled = invalid || confirmPassword !== password;
            return (
              <View>
                <Field
                  name="password"
                  type="password"
                  enableTogglePasswordOption={true}
                  placeholder={intl.formatMessage(
                    'ResetPassword.passwordLabel',
                  )}
                  validate={composeValidators(required(passwordRequired))}
                />
                <Field
                  name="confirmPassword"
                  type="password"
                  enableTogglePasswordOption={true}
                  placeholder={intl.formatMessage(
                    'ResetPassword.confirmPasswordLabel',
                  )}
                  validate={composeValidators(
                    required(confirmPasswordRequired),
                    compareTwoValues(
                      confirmPasswordNotEqualPassword,
                      password,
                      {compareOnlyIfRefValueExist: true},
                    ),
                  )}
                />
                {submitError ? (
                  <ErrorView
                    text={submitError?.data}
                    viewStyle={{paddingBottom: 0, paddingTop: 0}}
                  />
                ) : null}
                <PrimaryButton
                  disabled={submitDisabled}
                  onPress={onSubmit}
                  inProgress={submitting}>
                  <FormatedMessage
                    id="ResetPassword.submitBtn"
                    style={styles.submitText}
                  />
                </PrimaryButton>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  viewContainer: {
    ...container,
    padding: 0,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  backButton: {
    paddingVertical: 4,
    width: 36,
  },
  body: {
    padding: 16,
    paddingTop: 0,
  },
  title: {
    ...headerText,
    fontSize: 24,
    lineHeight: 36,
    paddingVertical: 16,
    paddingBottom: 4,
  },
  submitText: {
    ...normalFont,
    color: colors.white,
  },
});

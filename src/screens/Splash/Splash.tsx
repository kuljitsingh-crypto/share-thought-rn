import {Image, SafeAreaView, StyleSheet, Text} from 'react-native';
import React, {useEffect} from 'react';
import {colors, fonts} from '../../utill';
import {useConnect, useIntl} from '../../hooks';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {container} from '../../styles/appDefaultStyle';
import {AppDispatchType, AppSelectorType} from '../../../store';
import {
  fetchCurrentUser,
  selectCurrentUserFetchStatus,
} from '../../globalReducers/userSlice';
import {FETCH_STATUS} from '../../custom-config';
import {ScreenParamList} from '../screenTypes';

const splashScreenImg = require('../../assets/icons/splash_icon.png');

type SplashProps = NativeStackScreenProps<ScreenParamList, 'splash'>;

const mapDispatchToProps = (dispatch: AppDispatchType) => ({
  onFetchCurrentUser: () => dispatch(fetchCurrentUser()),
});

const mapStateToProps = (selector: AppSelectorType) => ({
  currentUserFetchStatus: selector(selectCurrentUserFetchStatus),
});

const Splash = (props: SplashProps) => {
  const {navigation} = props;
  const intl = useIntl();
  // const {onFetchCurrentUser, currentUserFetchStatus} = useConnect(
  //   mapStateToProps,
  //   mapDispatchToProps,
  // );
  // const {deepLinkStatus, redirectPath, redirectPathParams} = useDeepLink();
  // const moveToPath = (path: any, params?: ScreenParamType) => {
  //   if (!screenNames.hasOwnProperty(path)) {
  //     return;
  //   }
  //   navigation.navigate(path, params);
  // };
  // useEffect(() => {
  //   if (deepLinkStatus === FETCH_STATUS.succeeded) onFetchCurrentUser();
  // }, [deepLinkStatus]);

  // useEffect(() => {
  //   if (
  //     currentUserFetchStatus === FETCH_STATUS.succeeded ||
  //     currentUserFetchStatus === FETCH_STATUS.failed
  //   ) {
  //     moveToPath(redirectPath, redirectPathParams);
  //   }
  // }, [currentUserFetchStatus]);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={splashScreenImg} style={styles.img} />
      <Text style={styles.title}>{intl.formatMessage('Splash.title')}</Text>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    ...container,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 128,
    height: 128,
  },
  title: {
    color: colors.primaryDark,
    fontSize: 28,
    lineHeight: 42,
    marginTop: 8,
    fontWeight: '600',
    fontFamily: fonts.italic,
  },
});

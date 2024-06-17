import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {container} from '../../styles/appDefaultStyle';
import {FormatedMessage, SecondaryButton} from '../../components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppDispatchType, AppSelectorType} from '../../../store';
import {logOut, selectLogoutError, selectLogoutStatus} from './profileSlice';
import {useConnect} from '../../hooks';
import {FETCH_STATUS} from '../../custom-config';
import {ScreenParamList, screenNames} from '../screenTypes';

const mapDispatchToProps = (dispatch: AppDispatchType) => ({
  onLogout: () => dispatch(logOut()),
});

const mapStateToProps = (selector: AppSelectorType) => {
  return {
    logoutStatus: selector(selectLogoutStatus),
    logoutError: selector(selectLogoutError),
  };
};

type ProfilePros = NativeStackScreenProps<ScreenParamList, 'profile'>;

const Profile = (props: ProfilePros) => {
  const {navigation, route} = props;
  const {logoutStatus, onLogout} = useConnect(
    mapStateToProps,
    mapDispatchToProps,
  );
  return (
    <View style={container}>
      <Text>Profile</Text>
      <SecondaryButton
        inProgress={logoutStatus === FETCH_STATUS.loading}
        onPress={onLogout}>
        <FormatedMessage id="Profile.logout" />
      </SecondaryButton>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});

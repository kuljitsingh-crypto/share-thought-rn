import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {container, normalFont} from '../../styles/appDefaultStyle';
import {FormatedMessage, SecondaryButton} from '../../components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppDispatchType, AppSelectorType} from '../../../store';
import {logOut, selectLogoutError, selectLogoutStatus} from './profileSlice';
import {useConnect} from '../../hooks';
import {FETCH_STATUS} from '../../custom-config';
import {ScreenParamList, screenNames} from '../screenTypes';
import {selectCurrentUser} from '../../globalReducers/userSlice';
import {colors} from '../../utill';

const mapDispatchToProps = (dispatch: AppDispatchType) => ({
  onLogout: () => dispatch(logOut()),
});

const mapStateToProps = (selector: AppSelectorType) => {
  return {
    logoutStatus: selector(selectLogoutStatus),
    logoutError: selector(selectLogoutError),
    currentUser: selector(selectCurrentUser),
  };
};

type ProfilePros = NativeStackScreenProps<ScreenParamList, 'profile'>;

const Profile = (props: ProfilePros) => {
  const {navigation, route} = props;
  const {logoutStatus, currentUser, onLogout} = useConnect(
    mapStateToProps,
    mapDispatchToProps,
  );

  return (
    <View style={container}>
      <Text style={{...normalFont, fontSize: 24, color: colors.black}}>
        {currentUser?.email}
      </Text>
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

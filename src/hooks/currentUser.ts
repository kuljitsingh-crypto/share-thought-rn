import {useSelector} from 'react-redux';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '../globalReducers/userSlice';
import {
  ScreenParamList,
  ScreenParamType,
  ScreenValue,
} from '../screens/screenTypes';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect} from 'react';

export default function useCurrentUser() {
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isCurrentUserLoaded = !!(
    isAuthenticated &&
    currentUser &&
    currentUser.id &&
    typeof currentUser.id === 'string'
  );
  return {currentUser, isAuthenticated, isCurrentUserLoaded};
}

export const useRedirectOnCurrentUserLoaded = (
  screenName: ScreenValue,
  params?: ScreenParamType,
) => {
  const {isAuthenticated, isCurrentUserLoaded} = useCurrentUser();
  const navigation = useNavigation<
    NativeStackScreenProps<ScreenParamList>
  >() as any;
  useEffect(() => {
    if (isAuthenticated && isCurrentUserLoaded) {
      navigation.replace(screenName, params);
    }
  }, [isAuthenticated, isCurrentUserLoaded]);
};

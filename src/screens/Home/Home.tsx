import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../utill/colors';
import {useIntl} from '../../hooks';
import {Icon, InlineTextButton} from '../../components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {container} from '../../styles/appDefaultStyle';
import {fonts} from '../../utill';
import {ScreenParamList, ScreenValue, screenNames} from '../screenTypes';

const topbarIcon = require('../../assets/icons/app_trans_icon.png');

type NavigationProps = NativeStackScreenProps<ScreenParamList, 'home'>;

type TopbarProps = Pick<NavigationProps, 'navigation'>;
const TopBarComponent = (props: TopbarProps) => {
  const {navigation} = props;
  const intl = useIntl();
  const navigateTo = (pathName: any) => {
    navigation.navigate(pathName);
  };

  return (
    <View style={styles.topbarContainer}>
      <Image source={topbarIcon} style={styles.iconImg} />
      <Text style={styles.topbarTitle}>
        {intl.formatMessage('Home.topbar.title')}
      </Text>
      <View style={styles.helperBtnContainer}>
        <InlineTextButton
          style={styles.helperBtn}
          onPress={() => navigateTo(screenNames.myPost)}>
          <Icon
            iconType="material-community"
            name="folder-account"
            size={28}
            color={colors.white}
          />
        </InlineTextButton>
        <InlineTextButton
          style={styles.helperBtn}
          onPress={() => navigateTo(screenNames.createPost)}>
          <Icon
            iconType="material"
            name="post-add"
            size={28}
            color={colors.white}
          />
        </InlineTextButton>
        <InlineTextButton
          style={styles.helperBtn}
          onPress={() => navigateTo(screenNames.profile)}>
          <Icon
            iconType="fontawesome5"
            name="user-cog"
            size={24}
            color={colors.white}
          />
        </InlineTextButton>
      </View>
    </View>
  );
};

type HomeProps = NavigationProps;
const Home = (props: HomeProps) => {
  const {navigation} = props;
  return (
    <SafeAreaView style={styles.container}>
      <TopBarComponent navigation={navigation} />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    ...container,
    padding: 0,
  },
  topbarContainer: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  iconImg: {
    width: 48,
    height: 48,
    marginLeft: 4,
  },
  topbarTitle: {
    fontSize: 18,
    lineHeight: 32,
    color: colors.white,
    fontFamily: fonts.regluar,
    fontWeight: '100',
    marginLeft: 8,
  },
  helperBtnContainer: {
    marginLeft: 'auto',
    flexDirection: 'row',
  },
  helperBtn: {
    height: 36,
    width: 32,
    marginRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

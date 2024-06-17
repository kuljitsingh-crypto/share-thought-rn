import Home from './Home/Home';
import Splash from './Splash/Splash';
import Profile from './Profile/Profile';
import CreatePost from './CreatePost/CreatePost';
import MyPosts from './MyPosts/MyPosts';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import {colors} from '../utill';
import RecoverPassword from './RecoverPassword/RecoverPassword';
import {ScreenConfiguration, screenNames} from './screenTypes';
import ResetPassword from './ResetPassword/ResetPassword';

type ScreenConfigurations =
  | ScreenConfiguration<'splash'>
  | ScreenConfiguration<'home'>
  | ScreenConfiguration<'myPost'>
  | ScreenConfiguration<'createPost'>
  | ScreenConfiguration<'profile'>
  | ScreenConfiguration<'login'>
  | ScreenConfiguration<'signUp'>
  | ScreenConfiguration<'recoverPassword'>
  | ScreenConfiguration<'resetPassword'>;

export const screenConfigurations = (): ScreenConfigurations[] => {
  return [
    {
      name: screenNames.splash,
      component: Splash,
      options: {headerShown: false},
      isSplashScreen: true,
    },
    {
      name: screenNames.home,
      component: Home,
      options: {headerShown: false},
    },
    {
      name: screenNames.profile,
      component: Profile,
      auth: true,
    },
    {
      name: screenNames.createPost,
      component: CreatePost,
      auth: true,
    },
    {
      name: screenNames.myPost,
      component: MyPosts,
      auth: true,
    },
    {
      name: screenNames.login,
      component: Login,
      options: {headerShown: false},
    },
    {
      name: screenNames.signUp,
      component: Signup,
      options: {
        headerShown: true,
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: {backgroundColor: colors.white},
      },
    },
    {
      name: screenNames.recoverPassword,
      component: RecoverPassword,
      options: {
        headerShown: true,
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: {backgroundColor: colors.white},
      },
    },
    {
      name: screenNames.resetPassword,
      component: ResetPassword,
      options: {
        headerShown: false,
      },
    },
  ];
};

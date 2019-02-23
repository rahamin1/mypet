import React from 'react';
import { createStackNavigator } from 'react-navigation';

import Welcome from '../screens/welcome/Welcome';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgottenPasswordScreen from '../screens/auth/ForgottenPasswordScreen';

const AuthStack = createStackNavigator({
  Login: { screen: LoginScreen },
  Signup: { screen: SignupScreen },
  ForgottenPassword: {
    screen: ForgottenPasswordScreen,
    navigationOptions: { title: 'Forgot Password' } }
},  {
  // navigationOptions: ({ navigation }) => ({
    headerMode: 'none',
    initialRouteName: 'Login'
  // })
});

const WelcomeAuthNavigator = createStackNavigator({
  Welcome: Welcome,
  Auth: AuthStack
}, {
   headerMode: 'none',
   initialRouteName: 'Welcome',
   contentComponent: props => <Drawer {...props} />
 });

 export default WelcomeAuthNavigator;

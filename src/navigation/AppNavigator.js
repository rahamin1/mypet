import React from 'react';
import { createDrawerNavigator } from 'react-navigation';

import WelcomeAuthNavigator from './WelcomeAuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import MainDrawerNavigator from './MainDrawerNavigator';
import Drawer from '../screens/drawers/Drawer';

export default createDrawerNavigator({
    WelcomeAuth: WelcomeAuthNavigator,
    Drawer: MainDrawerNavigator,
    Main: MainTabNavigator
}, {
  initialRouteName: 'WelcomeAuth',
  contentComponent: props => <Drawer {...props} />,
  drawerWidth: 180
});

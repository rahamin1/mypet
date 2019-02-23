import React from 'react';
import { Platform, Text } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../screens/tabs/TabBarIcon';

import Photos from '../screens/tabs/Photos/Photos';
import PhotoEdit from '../screens/tabs/Photos/PhotoEdit';
import PhotoDisplay from '../screens/tabs/Photos/PhotoDisplay';

import Medicals from '../screens/tabs/Medical/Medicals';
import MedicalEdit from '../screens/tabs/Medical/MedicalEdit';
import MedicalDisplay from '../screens/tabs/Medical/MedicalDisplay';

import Contacts from '../screens/tabs/Contacts/Contacts';
import ContactEdit from '../screens/tabs/Contacts/ContactEdit';
import ContactDisplay from '../screens/tabs/Contacts/ContactDisplay';

import Food from '../screens/tabs/Food/Food';

const PhotosStack = createStackNavigator({
  Photo: {
    screen: Photos,
    navigationOptions: () => ({
        title: 'Photos'
    })
  },
  PhotoEdit: PhotoEdit,
  PhotoDisplay: PhotoDisplay
}, {
  initialRouteName: 'Photo'
});

PhotosStack.navigationOptions = {
  headerMode: 'none',
  tabBarLabel: 'Photos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ?
          `ios-photos${focused ? '' : '-outline'}` :
          'md-photos'
      }
    />
  )
};

const MedicalsStack = createStackNavigator({
  Medicals: {
    screen: Medicals,
    navigationOptions: () => ({
        title: 'Medicals'
    })
  },
  MedicalEdit: MedicalEdit,
  MedicalDisplay: MedicalDisplay
}, {
  // initialRouteName: 'MedicalEdit'
  initialRouteName: 'Medicals'
});

MedicalsStack.navigationOptions = {
  tabBarLabel: 'Medical',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-medkit'}
    />
  )
};

const FoodStack = createStackNavigator({
  Food: {
    screen: Food,
    navigationOptions: () => ({
        title: 'Food'
    })
  }
}, {
  initialRouteName: 'Food'
});

FoodStack.navigationOptions = {
  tabBarLabel: 'Food',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-pizza${focused ? '' : '-outline'}` : 'md-pizza'}
    />
  )
};

const ContactsStack = createStackNavigator({
  Contacts: {
    screen: Contacts,
    navigationOptions: () => ({
        title: 'Contacts'
    })
  },
  ContactEdit: ContactEdit,
  ContactDisplay: ContactDisplay
}, {
  // initialRouteName: 'ContactEdit'
  initialRouteName: 'Contacts'
});

ContactsStack.navigationOptions = {
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-medkit'}
    />
  )
};

const MainTabNavigator = createBottomTabNavigator({
  MedicalsStack,
  PhotosStack,
  FoodStack,
  ContactsStack
}, {
    headerMode: 'none',
    headerStyle: { backgroundColor: '#4C3E54' },
    headerLeft: <Text onPress={() =>
      this.props.navigation.navigate('DrawerOpen')}>Menu</Text>,
    title: 'Welcome!',
    headerTintColor: 'white',
    // backBehavior: 'none',
    initialRouteName: 'MedicalsStack'
    // initialRouteName: 'PhotosStack'
    //initialRouteName: 'ContactsStack'
});

export default MainTabNavigator;

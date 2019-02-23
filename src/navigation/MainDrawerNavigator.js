import { createStackNavigator } from 'react-navigation';

import Pet from '../screens/drawers/Pet';
import Help from '../screens/drawers/Help';
import About from '../screens/drawers/About';
import Bugs from '../screens/drawers/Bugs';

const MainDrawerNavigator = createStackNavigator({
  Pet: { screen: Pet },
  Help: { screen: Help },
  About: { screen: About },
  Bugs: { screen: Bugs }
}, {
  initialRouteName: 'About'
});

export default MainDrawerNavigator;

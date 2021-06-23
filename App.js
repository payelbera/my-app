import React from 'react';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';
import ResetPassword from './screens/ResetScreen'
import WelcomeScreen from './screens/WelcomeScreen';
import { AppDrawerNavigator } from './components/AppDrawerNavigator'
import { AppTabNavigator } from './components/AppTabNavigator' 


export default function App() {
  return (
    <AppContainer/>
  );
}


const switchNavigator = createSwitchNavigator({
  WelcomeScreen:{screen: WelcomeScreen},
  Drawer:{screen: AppDrawerNavigator},
  BottomTab: {screen: AppTabNavigator},
  ResetPassword:{screen:ResetPassword}
})

const AppContainer =  createAppContainer(switchNavigator);

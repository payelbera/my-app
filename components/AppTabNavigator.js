import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
//import { AppStackNavigator } from './AppStackNavigator'
import HomeScreen from '../screens/HomeScreen';
import DisplayScreen from '../screens/DisplayScreen';

export const AppTabNavigator = createBottomTabNavigator({
    HomeScreen : {
    screen: HomeScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/icon.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Home Screen",
    }
  },
  DisplayScreen: {
    screen: DisplayScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/splash.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Display Screen",
    }
  }
});

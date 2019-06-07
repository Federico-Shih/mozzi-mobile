import {Platform, Text, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import {MainPage, Register, Login} from './src/pages/pages.js';
import {createStackNavigator, createAppContainer} from 'react-navigation';
//import MainPage from './src/pages/mainPage';

type Props = {};

const AppNavigator = createStackNavigator({
  Home: {
    screen: MainPage,
  } 
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component<Props> {
  render() {
    return <AppContainer />
  }
}
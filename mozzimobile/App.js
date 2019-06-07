import {Platform, Text, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import {MainPage} from './src/pages/mainPage.js';

type Props = {};

export default class App extends Component<Props> {
  render() {
    return(
      <MainPage />
    );
  };
}
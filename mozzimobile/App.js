/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Text, View} from 'react-native';
import styles from './Styles.js';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

class Title extends Component<Props> {
  render() {
    <View>
      <Text style={{fontSize: 40},styles.title}>
        {this.props.text}  
      </Text>
    </View>
  }
}

export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Title text = "Mozzi"/>
      </View>
    );
  }
}


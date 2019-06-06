import {Platform, Text, View} from 'react-native';
import React, {Component} from 'react';
import styles from './styles/styles.js';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

class Title extends Component<Props> {
  render() {
    return (
      <Text style={styles.title}>
        {this.props.text}
      </Text>
    );
  }
}

export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Title text="Mozzi Project"/>
      </View>
    );
  }
}

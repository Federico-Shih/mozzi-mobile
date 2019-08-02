import { Text, View } from 'react-native';
import React, { Component } from 'react';
import styles from '../libraries/styles/styles';

type Props = {};

export default class CalendarPage extends Component<Props> {
  state = {};

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Calendars</Text>
      </View>
    );
  }
}

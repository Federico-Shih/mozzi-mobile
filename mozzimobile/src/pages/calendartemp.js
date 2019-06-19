import {Text, View} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import {Title, Button} from '../libraries/props';

type Props = {};

export default class CalendarPage extends Component<Props> {
    render() {
      return (
        <View style={styles.container}>
           <Text style={styles.textTest}>
                Calendars
          </Text>
        </View>
      );
    }
}


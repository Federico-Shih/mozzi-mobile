import {Text, View} from 'react-native';
import React, {Component} from 'react';
import styles from '../styles/styles';
import {Title, Button} from '../props';

type Props = {};

export default class Register extends Component<Props> {
    render() {
      return (
        <View style={styles.container}>
           <Text style={styles.textTest}>
                Register
          </Text>
        </View>
      );
    }
}


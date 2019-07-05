import {Text, View} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';

type Props = {};

export default class Buscador extends Component<Props> {
    render() {
      return (
        <View style={styles.container}>
          <Text>
                Turnos
          </Text>
        </View>
      );
    }
}


import { Text, View, Platform } from 'react-native';
import React, { Component } from 'react';
// import { Divider, Button, Icon } from 'react-native-elements';

import styles from '../libraries/styles/styles';
import { BackButton } from '../libraries/props';

type Props = {};

export default class Buscador extends Component<Props> {
  state = {};

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <BackButton navigation={navigation} />
      </View>
    );
  }
}

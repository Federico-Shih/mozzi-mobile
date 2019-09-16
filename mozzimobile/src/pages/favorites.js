import { Text, View } from 'react-native';
import React, { Component } from 'react';

import styles from '../libraries/styles/styles';
import { BackButton } from '../libraries/props';

type Props = {};

export default class Favorites extends Component<Props> {
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

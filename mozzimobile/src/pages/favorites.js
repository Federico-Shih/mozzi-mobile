import {
  Text,
  View,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  BackHandler,
  Keyboard,
} from 'react-native';
import React, { Component } from 'react';
import {
  SearchBar, Button, Icon, Divider,
} from 'react-native-elements';
import PropTypes from 'prop-types';

import styles from '../libraries/styles/styles';
import { BackButton } from '../libraries/props';
import { platformBackColor } from '../libraries/styles/constants';
import { sendPopup, errorMessages, units, UserData } from '../libraries/helpers';

type Props = {};

const MyButton = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback,
});

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

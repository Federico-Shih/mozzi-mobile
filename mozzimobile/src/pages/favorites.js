import {
  Text,
  View,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import React, { Component } from 'react';
import {
  SearchBar, Button, Icon, Divider, Header,
} from 'react-native-elements';
import PropTypes from 'prop-types';

import styles from '../libraries/styles/styles';
import { BackButton } from '../libraries/props';
import { platformBackColor } from '../libraries/styles/constants';
import {
  sendPopup, errorMessages, units, UserData,
} from '../libraries/helpers';

type Props = {};

const MyButton = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback,
});

export default class Favorites extends Component<Props> {
  state = {};

  toggle() {
    const { navigation } = this.props;
    navigation.openDrawer();
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={(
            <Button
              containerStyle={{ bottom: '50%' }}
              icon={<Icon name="menu" size={30} />}
              type="clear"
              onPress={() => {
                this.toggle();
              }}
            />
)}
          containerStyle={{
            height: 60,
            backgroundColor: platformBackColor,
            borderWidth: 0,
          }}
          placement="left"
        />
      </View>
    );
  }
}

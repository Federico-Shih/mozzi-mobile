import {
  Text,
  View,
  Platform,
  Alert,
  TouchableHighlight,
  TouchableNativeFeedback,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, { Component } from 'react';
import {
  Divider,
  Button,
  Icon,
  SearchBar,
  Header,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from '../libraries/styles/styles';
import { platformBackColor } from '../libraries/styles/constants';

type Props = {};

export default class ConfigPage extends Component<Props> {
  state = {};

  toggle() {
    const { navigation } = this.props;
    navigation.openDrawer();
  }

  render() {
    const { navigation } = this.props;
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

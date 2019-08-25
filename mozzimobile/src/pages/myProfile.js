import { Text, View, Platform } from 'react-native';
import React, { Component } from 'react';
import { Divider, Button, Icon } from 'react-native-elements';

import styles from '../libraries/styles/styles';
import { platformBackColor } from '../libraries/styles/constants';

type Props = {};

export default class Buscador extends Component<Props> {
  state = {};

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Button
          icon={(
            <Icon
              name={Platform.select({
                ios: 'arrow-back-ios',
                android: 'arrow-back',
              })}
              size={30}
              color="gray"
            />
)}
          onPress={() => {
            navigation.goBack();
          }}
          containerStyle={{
            borderRadius: 50,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            height: 50,
          }}
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: platformBackColor,
            marginLeft: 5,
            marginTop: 5,
          }}
        />
      </View>
    );
  }
}

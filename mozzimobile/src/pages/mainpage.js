import { View, Dimensions } from 'react-native';
import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from '../libraries/styles/styles';
import { Title } from '../libraries/props';

type Props = {};

const ButtonWidth = Math.round((200 * 411) / Dimensions.get('window').width);

class MainPage extends Component<Props> {
  static propTypes = {
    navigation: PropTypes.objectOf(PropTypes.object).isRequired,
  };

  changePage(newPage) {
    const { navigation } = this.props;
    navigation.navigate(newPage);
  }

  render() {
    return (
      <View style={styles.container}>
        <Title text="Mozzi Project" />

        <View
          style={{
            alignItems: 'center',
            top: 50,
            width: '80%',
            height: '50%',
          }}
        >
          <Button
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 40,
              right: 40,
            }}
            onPress={() => this.changePage('Login')}
            title="Login"
            titleStyle={{ fontSize: 30 }}
            type="outline"
            buttonStyle={{ borderWidth: 3, width: ButtonWidth }}
          />

          <Button
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 40,
              right: 40,
            }}
            onPress={() => this.changePage('Register')}
            title="Register"
            titleStyle={{ fontSize: 30 }}
            type="outline"
            containerStyle={{ top: '5%' }}
            buttonStyle={{ borderWidth: 3, width: ButtonWidth }}
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentPage: state.currentPage,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainPage);

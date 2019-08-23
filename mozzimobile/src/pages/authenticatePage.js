// modules
import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
  TouchableNativeFeedback,
  TouchableHighlight,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
// codes
import { validateEmail, errorMessages, sendPopup } from '../libraries/helpers';
import { register } from '../libraries/connect/auth';
import styles from '../libraries/styles/styles';
import { StyledTitle, Popup } from '../libraries/props';
import { LOADING, GET_TOKEN } from '../actions';

const Button = Platform.select({
  ios: TouchableHighlight,
  android: TouchableNativeFeedback,
});

const duration = 50;

class Authenticate extends Component<Props> {
  state = {
    loginSize: new Animated.Value(25),
    loginHeight: new Animated.Value(34),
    registerSize: new Animated.Value(20),
    registerHeight: new Animated.Value(27),
  };

  changeToRegister = () => {
    const { loginSize, registerSize } = this.state;
    Animated.parallel([
      Animated.timing(loginSize, {
        toValue: 20,
        duration,
      }),
      Animated.timing(registerSize, {
        toValue: 25,
        duration,
      }),
    ]).start();
  };

  changeToLogin = () => {
    const { loginSize, registerSize } = this.state;
    Animated.parallel([
      Animated.timing(loginSize, {
        toValue: 25,
        duration,
      }),
      Animated.timing(registerSize, {
        toValue: 20,
        duration,
      }),
    ]).start();
  };

  render() {
    const {
      loginSize, loginHeight, registerSize, registerHeight,
    } = this.state;
    return (
      <SafeAreaView style={{ backgroundColor: '#5819E0', flex: 1 }}>
        <View
          style={{
            flex: 1,
            top: '18%',
            borderRadius: 70,
            backgroundColor: '#FFFFFF',
          }}
        >
          <View
            style={{
              width: '82%',
              marginTop: 78,
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingRight: 25,
              }}
            >
              <Button
                onPress={this.changeToLogin}
                background={TouchableNativeFeedback.Ripple('#CCC')}
              >
                <View style={{}}>
                  <Animated.Text
                    style={{
                      fontSize: loginSize,
                      lineHeight: loginHeight,
                      color: 'black',
                      fontFamily: 'Nunito-SemiBold',
                    }}
                  >
                    {'Inicia Sesion '}
                  </Animated.Text>
                </View>
              </Button>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}
            >
              <Button
                onPress={this.changeToRegister}
                background={TouchableNativeFeedback.Ripple('#CCC')}
              >
                <View
                  style={{
                    overflow: 'hidden',
                  }}
                >
                  <Animated.Text
                    style={{
                      fontSize: registerSize,
                      fontFamily: 'Nunito-SemiBold',
                      lineHeight: registerHeight,
                      color: 'black',
                    }}
                  >
                    {'Registrate '}
                  </Animated.Text>
                </View>
              </Button>
            </View>
          </View>
          <View
            style={{
              width: '80%',
              height: '100%',
              backgroundColor: 'yellow',
              alignSelf: 'center',
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading,
    token: state.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLoading: (isLoading) => {
      dispatch({
        type: LOADING,
        loading: isLoading,
      });
    },
    setToken: (token) => {
      dispatch({
        type: GET_TOKEN,
        token,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Authenticate);

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
import { Input, Button } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

// codes
import { validateEmail, errorMessages, sendPopup } from '../libraries/helpers';
import { register, login } from '../libraries/connect/auth';

import styles from '../libraries/styles/styles';
import { StyledTitle, Popup } from '../libraries/props';
import { LOADING, GET_TOKEN } from '../actions';
import buttonStyle from '../libraries/styles/buttonsStyles';

const SpecialButton = Platform.select({
  ios: TouchableHighlight,
  android: TouchableNativeFeedback,
});

const ScreenSizeWidth = Dimensions.get('window').width;

const duration = 50;

const slideDuration = 500;

class Authenticate extends Component<Props> {
  state = {
    loginSize: new Animated.Value(25),
    loginHeight: new Animated.Value(34),
    registerSize: new Animated.Value(20),
    registerHeight: new Animated.Value(27),
    slideValue: new Animated.Value(0),
    underLinePosition: new Animated.Value(ScreenSizeWidth / 10 + 4),
    isLoginShow: true,
    connection: null,
    loginState: {
      email: '',
      password: '',
    },
    registerState: {
      name: '',
      surname: '',
      email: '',
      password: '',
      tempConfirmedPassword: '',
    },
  };

  registerError = {
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmpassword: '',
  };

  registerStyle = {
    name: styles.inputText,
    surname: styles.inputText,
    email: styles.inputText,
    password: styles.inputText,
    confirmpassword: styles.inputText,
  };

  loginError = {
    email: '',
    password: '',
  };

  loginStyle = {
    email: styles.inputText,
    password: styles.inputText,
  };

  // Error and Style handlers
  setErrorState = (incomingJson) => {
    const { isLoginShow } = this.state;
    const key = isLoginShow ? 'login' : 'register';
    const prevError = this[`${key}Error`];
    this[`${key}Error`] = { ...prevError, ...incomingJson };
    this.forceUpdate();
  };

  setStyle = (incomingStyle) => {
    const { isLoginShow } = this.state;
    const key = isLoginShow ? 'login' : 'register';
    const prevStyle = this[`${key}Style`];
    this[`${key}Style`] = { ...prevStyle, ...incomingStyle };
    this.forceUpdate();
  };

  // Changing colors of the input boxes
  errorInput = (object) => {
    for (let i = 0; i < object.length; i += 1) {
      this.setStyle({
        [object[i].key]: { ...styles.inputText, borderColor: 'red' },
      });
      this.setErrorState({ [object[i].key]: object[i].message });
    }
  };

  validInput = (keyList) => {
    for (let i = 0; i < keyList.length; i += 1) {
      this.setStyle({ [keyList[i]]: styles.inputText });
      this.setErrorState({ [keyList[i]]: '' });
    }
  };

  checkConnectivity = () => new Promise((resolve) => {
    if (Platform.OS === 'android') {
      NetInfo.isConnected.fetch().then((isConnected) => {
        if (isConnected) {
          this.setState({ connection: true });
          resolve();
        } else {
          sendPopup(errorMessages.noConnection);
          this.setState({ connection: false });
          resolve();
        }
      });
    } else {
      NetInfo.isConnected.addEventListener(
        'connectionChange',
        this.handleFirstConnectivityChange,
      );
      resolve();
    }
  });

  handleFirstConnectivityChange = (isConnected) => {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );

    if (isConnected === false) {
      this.setState({ connection: false });
    } else {
      this.setState({ connection: true });
    }
  };

  // Input Error section
  displayErrorMessage = (key) => {
    const { isLoginShow } = this.state;
    const error = this[isLoginShow ? 'loginError' : 'registerError'];
    if (error[key]) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <Text
            style={{
              color: 'red',
              paddingLeft: (1 / 10) * Dimensions.get('window').width,
            }}
          >
            {error[key]}
          </Text>
        </View>
      );
    }
    return null;
  };

  // Validating inputs
  checkIfValidEmailAndSet = (
    { isLoginShow, loginState, registerState } = this.state,
  ) => new Promise(async (resolve) => {
    const email = isLoginShow ? loginState.email : registerState.email;
    if (validateEmail(email)) {
      this.validInput(['email']);
      resolve(true);
    } else {
      this.errorInput([{ key: 'email', message: errorMessages.email }]);
      resolve(false);
    }
  });

  checkIfValidPasswordAndSet = (
    { isLoginShow, loginState, registerState } = this.state,
  ) => new Promise(async (resolve) => {
    const password = isLoginShow
      ? loginState.password
      : registerState.password;
    if (password.length >= 8) {
      this.validInput(['password']);
      resolve(true);
    } else {
      this.errorInput([{ key: 'password', message: errorMessages.password }]);
      resolve(false);
    }
  });

  checkIfInputIsEmpty = key => new Promise(async (resolve) => {
    const { isLoginShow } = this.state;
    const selected = isLoginShow ? 'loginState' : 'registerState';
    // eslint-disable-next-line react/destructuring-assignment
    const currentState = this.state[selected];
    // eslint-disable-next-line react/destructuring-assignment
    if (/\s/.test(currentState[key])) {
      this.errorInput([{ key, message: errorMessages[key].spaces }]);
      resolve(false);
      // eslint-disable-next-line react/destructuring-assignment
    } else if (currentState[key]) {
      this.validInput([key]);
      resolve(true);
    } else {
      this.errorInput([{ key, message: errorMessages[key].empty }]);
      resolve(false);
    }
  });

  // Only for Register
  checkIfPasswordsMatchAndSet = ({ registerState } = this.state) => new Promise(async (resolve) => {
    const { password, tempConfirmedPassword } = registerState;
    if (
      password === tempConfirmedPassword
        && tempConfirmedPassword
        && tempConfirmedPassword.length >= 8
    ) {
      this.validInput(['password', 'confirmpassword']);
      resolve(true);
    } else if (!tempConfirmedPassword) {
      this.errorInput([
        {
          key: 'confirmpassword',
          message: errorMessages.confirmpassword.empty,
        },
      ]);
      resolve(false);
    } else if (tempConfirmedPassword.length < 8) {
      this.errorInput([
        { key: 'password', message: errorMessages.password },
        { key: 'confirmpassword', message: errorMessages.password },
      ]);
      resolve(false);
    } else {
      this.errorInput([
        {
          key: 'confirmpassword',
          message: errorMessages.confirmpassword.nomatch,
        },
      ]);
      resolve(false);
    }
  });

  // Login function
  checkAndLogin = async () => {
    const checkPass = await this.checkIfValidPasswordAndSet();
    const checkEmail = await this.checkIfValidEmailAndSet();

    if (checkPass && checkEmail) {
      await this.checkConnectivity();
      const { connection } = this.state;
      if (!connection) {
        sendPopup(errorMessages.noConnection);
        return;
      }

      const { setLoading, setToken, navigation } = this.props;
      const { loginState } = this.state;
      const { email, password } = loginState;
      setLoading(true);

      try {
        const res = await login(email, password);
        if (!res.data.login) {
          for (let i = 0; i < res.errors.length; i += 1) {
            sendPopup(res.errors[i].message);
          }
        } else {
          setToken(res.data.login);
          navigation.navigate('Home');
        }
        setLoading(false);
      } catch (error) {
        sendPopup(error.message);
        setLoading(false);
      }
    }
  };

  // Create account function
  checkAndRegister = async () => {
    const checkPass = await this.checkIfValidPasswordAndSet();
    const checkMatch = await this.checkIfPasswordsMatchAndSet();
    const checkEmail = await this.checkIfValidEmailAndSet();
    const checkName = await this.checkIfInputIsEmpty('name');
    const checkLastname = await this.checkIfInputIsEmpty('surname');

    if (checkPass && checkMatch && checkEmail && checkName && checkLastname) {
      await this.checkConnectivity();
      const { connection, registerState } = this.state;
      const {
        name, surname, email, password,
      } = registerState;

      if (!connection) {
        sendPopup(errorMessages.noConnection);
        return;
      }

      const { setLoading, navigation, setToken } = this.props;

      // calling function
      setLoading(true);
      try {
        const res = await register(name, surname, email, password);
        if (!res.data.register) {
          for (let i = 0; i < res.errors.length; i += 1) {
            sendPopup(res.errors[i].message);
          }
        } else {
          setToken(res.data.register);
          navigation.navigate('Home');
        }
        setLoading(false);
      } catch (error) {
        sendPopup(error.message);
        setLoading(false);
      }
    }
  };

  changeToRegister = () => {
    const {
      loginSize,
      registerSize,
      slideValue,
      underLinePosition,
    } = this.state;
    this.setState({ isLoginShow: false });
    Animated.parallel([
      Animated.timing(loginSize, {
        toValue: 20,
        duration,
      }),
      Animated.timing(registerSize, {
        toValue: 25,
        duration,
      }),
      Animated.timing(slideValue, {
        toValue: -ScreenSizeWidth,
        slideDuration,
      }),
      Animated.timing(underLinePosition, {
        toValue: 10 + (ScreenSizeWidth * 5) / 10,
        slideDuration,
      }),
    ]).start();
  };

  changeToLogin = () => {
    const {
      loginSize,
      registerSize,
      slideValue,
      underLinePosition,
    } = this.state;
    this.setState({ isLoginShow: true });
    Animated.parallel([
      Animated.timing(loginSize, {
        toValue: 25,
        duration,
      }),
      Animated.timing(registerSize, {
        toValue: 20,
        duration,
      }),
      Animated.timing(slideValue, {
        toValue: 0,
        slideDuration,
      }),
      Animated.timing(underLinePosition, {
        toValue: 4 + (ScreenSizeWidth * 1) / 10,
        slideDuration,
      }),
    ]).start();
  };

  render() {
    const {
      loginSize,
      loginHeight,
      registerSize,
      registerHeight,
      loginState,
      slideValue,
      registerState,
      underLinePosition,
    } = this.state;
    const { name, surname } = registerState;
    const { navigation, loading } = this.props;
    return (
      <SafeAreaView style={{ backgroundColor: '#5819E0', flex: 1 }}>
        <View
          style={{
            flex: 1,
            top: '12%',
            borderRadius: 70,
            backgroundColor: '#FFFFFF',
          }}
        >
          <View
            style={{
              width: '82%',
              marginTop: 50,
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
              <SpecialButton
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
              </SpecialButton>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}
            >
              <SpecialButton
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
              </SpecialButton>
            </View>
          </View>
          <Animated.View
            style={{
              width: '14%',
              height: 4,
              top: 8,
              left: underLinePosition,
              backgroundColor: '#4600DA',
            }}
          />
          <View
            style={{
              marginTop: 40,
              width: '80%',
              height: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
            }}
          >
            {/* LOGIN COMPONENT */}
            <Animated.View
              style={{
                width: '100%',
                left: slideValue,
              }}
            >
              <Input
                keyboardType="email-address"
                placeholder="Email"
                inputStyle={{
                  fontFamily: 'Nunito-SemiBold',
                  fontWeight: '100',
                }}
                onChangeText={(text) => {
                  this.setState({
                    loginState: update(loginState, { email: { $set: text } }),
                  });
                }}
                onSubmitEditing={() => {
                  this.checkIfValidEmailAndSet();
                }}
                inputContainerStyle={{ ...this.loginStyle.email }}
                leftIcon={{
                  type: 'material',
                  name: 'email',
                  color: '#AAAAAA',
                  iconStyle: { left: 0 },
                }}
                shake
              />

              <View style={{ height: 20, justifyContent: 'flex-start' }}>
                {this.displayErrorMessage('email')}
              </View>
              <Input
                secureTextEntry
                placeholder="Password"
                inputStyle={{
                  fontFamily: 'Nunito-SemiBold',
                  fontWeight: '100',
                }}
                onChangeText={(text) => {
                  this.setState({
                    loginState: update(loginState, {
                      password: { $set: text },
                    }),
                  });
                }}
                onSubmitEditing={() => {
                  this.checkIfValidPasswordAndSet();
                }}
                inputContainerStyle={{ ...this.loginStyle.password }}
                leftIcon={{ type: 'material', name: 'lock', color: '#AAAAAA' }}
              />

              <View style={{ height: 20 }}>
                {this.displayErrorMessage('password')}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                  marginTop: -10,
                }}
              >
                <Button
                  title="¿Olvidaste tu contraseña?"
                  type="clear"
                  titleStyle={styles.forgotPassword}
                  containerStyle={{}}
                  onPress={() => {
                    navigation.navigate('Forgot');
                  }}
                />
              </View>
              <Button
                title="Iniciar Sesión"
                raised
                type="outline"
                loading={loading}
                onPress={() => {
                  this.checkAndLogin();
                }}
                titleStyle={buttonStyle.reglogButtonText}
                buttonStyle={{ ...buttonStyle.reglogButton }}
                containerStyle={{
                  marginTop: 50,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  alignSelf: 'center',
                }}
              >
                <Text style={{ ...styles.smallLogInText, alignSelf: 'center' }}>
                  ¿No tienes cuenta?
                </Text>
                <Button
                  title="Registrate."
                  type="clear"
                  titleStyle={styles.smallLogInText}
                  containerStyle={{}}
                  onPress={this.changeToRegister}
                />
              </View>
              <View style={{ flex: 1 }} />
            </Animated.View>
            {/* REGISTER COMPONENT */}
            <Animated.View
              style={{
                width: (ScreenSizeWidth * 4) / 5,
                height: '100%',
                left: slideValue,
                marginLeft: 80,
              }}
            >
              <Input
                placeholder="Name"
                inputStyle={{
                  fontFamily: 'Nunito-SemiBold',
                  fontWeight: '100',
                }}
                onChangeText={(text) => {
                  this.setState({
                    registerState: update(registerState, {
                      name: { $set: text },
                    }),
                  });
                }}
                value={name}
                inputContainerStyle={{
                  ...this.registerStyle.name,
                }}
                onSubmitEditing={() => {
                  this.checkIfInputIsEmpty('name');
                }}
                leftIcon={{
                  type: 'material',
                  name: 'account-circle',
                  color: '#AAAAAA',
                }}
              />
              <View style={{ height: 20 }}>
                {this.displayErrorMessage('name')}
              </View>

              <Input
                placeholder="Surname"
                inputStyle={{
                  fontFamily: 'Nunito-SemiBold',
                  fontWeight: '100',
                }}
                onChangeText={(text) => {
                  this.setState({
                    registerState: update(registerState, {
                      surname: { $set: text },
                    }),
                  });
                }}
                value={surname}
                inputContainerStyle={{ ...this.registerStyle.surname }}
                onSubmitEditing={() => {
                  this.checkIfInputIsEmpty('surname');
                }}
                leftIcon={{
                  type: 'material',
                  name: 'perm-identity',
                  color: '#AAAAAA',
                }}
              />
              <View style={{ height: 20 }}>
                {this.displayErrorMessage('surname')}
              </View>

              <Input
                keyboardType="email-address"
                placeholder="Email"
                inputStyle={{
                  fontFamily: 'Nunito-SemiBold',
                  fontWeight: '100',
                }}
                onChangeText={(text) => {
                  this.setState({
                    registerState: update(registerState, {
                      email: { $set: text.trim() },
                    }),
                  });
                }}
                onSubmitEditing={() => {
                  this.checkIfValidEmailAndSet();
                }}
                inputContainerStyle={{ ...this.registerStyle.email }}
                leftIcon={{ type: 'material', name: 'email', color: '#AAAAAA' }}
              />
              <View style={{ height: 20 }}>
                {this.displayErrorMessage('email')}
              </View>
              <Input
                secureTextEntry
                placeholder="Password"
                inputStyle={{
                  fontFamily: 'Nunito-SemiBold',
                  fontWeight: '100',
                }}
                onChangeText={(text) => {
                  this.setState({
                    registerState: update(registerState, {
                      password: { $set: text },
                    }),
                  });
                }}
                onSubmitEditing={() => {
                  this.checkIfValidPasswordAndSet();
                }}
                inputContainerStyle={{ ...this.registerStyle.password }}
                leftIcon={{ type: 'material', name: 'lock', color: '#AAAAAA' }}
              />
              <View style={{ height: 20 }}>
                {this.displayErrorMessage('password')}
              </View>
              <Input
                secureTextEntry
                inputStyle={{
                  fontFamily: 'Nunito-SemiBold',
                  fontWeight: '100',
                }}
                placeholder="Confirm Password"
                onChangeText={(text) => {
                  this.setState({
                    registerState: update(registerState, {
                      tempConfirmedPassword: { $set: text },
                    }),
                  });
                }}
                onSubmitEditing={() => {
                  this.checkIfPasswordsMatchAndSet();
                }}
                inputContainerStyle={{ ...this.registerStyle.confirmpassword }}
                leftIcon={{ type: 'material', name: 'lock', color: '#AAAAAA' }}
              />
              <View style={{ height: 20 }}>
                {this.displayErrorMessage('confirmpassword')}
              </View>

              <Button
                title="Crear cuenta"
                raised
                type="outline"
                loading={loading}
                onPress={() => {
                  this.checkAndRegister();
                }}
                titleStyle={buttonStyle.reglogButtonText}
                buttonStyle={{ ...buttonStyle.reglogButton }}
                containerStyle={{
                  marginTop: 50,
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  alignSelf: 'center',
                }}
              >
                <Text style={{ ...styles.smallLogInText, alignSelf: 'center' }}>
                  ¿Ya tenés una cuenta registrada?
                </Text>
                <Button
                  title="Inicia sesión."
                  type="clear"
                  titleStyle={styles.smallLogInText}
                  containerStyle={{}}
                  onPress={() => {
                    this.changeToLogin();
                  }}
                />
              </View>
              <View style={{ flex: 1 }} />
            </Animated.View>
          </View>
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

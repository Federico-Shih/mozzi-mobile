// modules
import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SafeAreaView,
  Animated,
  TouchableNativeFeedback,
  TouchableHighlight,
  TextInput,
  ScrollView,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Icon } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

// codes
import {
  validateEmail,
  errorMessages,
  sendPopup,
  units,
  UserData,
} from '../libraries/helpers';
import { register, login } from '../libraries/connect/auth';

import styles from '../libraries/styles/styles';
import { LOADING, GET_TOKEN } from '../actions';
import buttonStyle from '../libraries/styles/buttonsStyles';

const SpecialButton = Platform.select({
  ios: TouchableHighlight,
  android: TouchableNativeFeedback,
});

const {
  vh, vw, vmax, vmin,
} = units;

const maxSlideDistance = vw * 80;

const ScreenSizeWidth = Dimensions.get('window').width;

const slideDuration = 500;

const minSlideDuration = 200;

class Authenticate extends Component<Props> {
  state = {
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
    showPassLogin: false,
    showPassRegister: false,
    showConfirmRegister: false,
  };

  slideValue = new Animated.Value(0);

  nativeSlideValue = new Animated.Value(0);

  threshholdReached = false;

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

  async componentDidMount() {
    await UserData.loadRealm();
  }

  handleStateChange = ({ nativeEvent }) => {
    const { state, velocityX } = nativeEvent;
    console.log(nativeEvent);
    const eventState = state === State.END || state === State.CANCELLED;
    if (eventState) {
      const { isLoginShow } = this.state;
      if (this.threshholdReached) {
        if (isLoginShow && velocityX < 0) this.changeToRegister();
        else if (!isLoginShow && velocityX > 0) this.changeToLogin();
        this.threshholdReached = false;
      } else if (isLoginShow) {
        this.changeToLogin(true);
      } else {
        this.changeToRegister(true);
      }
    }
  };

  onPanGestureEvent = (e) => {
    const { translationX, velocityX } = e.nativeEvent;
    const { isLoginShow } = this.state;
    if (Math.abs(translationX) <= maxSlideDistance) {
      if (
        isLoginShow
        && translationX < 0
      ) {
        const slideX = Math.abs(translationX) / maxSlideDistance;
        this.slideValue.setValue(slideX);
        this.nativeSlideValue.setValue(slideX);
        if (slideX >= 0.4) {
          this.threshholdReached = true;
        } else {
          this.threshholdReached = false;
        }
      } else if (!isLoginShow && translationX > 0) {
        const slideX = 1 - Math.abs(translationX) / maxSlideDistance;
        this.slideValue.setValue(slideX);
        this.nativeSlideValue.setValue(slideX);
        if (1 - slideX >= 0.4) {
          this.threshholdReached = true;
        } else {
          this.threshholdReached = false;
        }
      }
    }
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
      const { setLoading, setToken, navigation } = this.props;
      const { loginState } = this.state;
      const { email, password } = loginState;
      setLoading(true);
      await this.checkConnectivity();
      const { connection } = this.state;
      if (!connection) {
        sendPopup(errorMessages.noConnection);
        setLoading(false);
        return;
      }

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

      const { setLoading, navigation, setToken } = this.props;
      if (!connection) {
        sendPopup(errorMessages.noConnection);
        setLoading(false);
        return;
      }

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

  changeToRegister = (override) => {
    const { isLoginShow } = this.state;
    // eslint-disable-next-line no-underscore-dangle
    const animDuration = (slideDuration - minSlideDuration) * (1 - this.slideValue._value) + minSlideDuration;
    if (isLoginShow || override) {
      Keyboard.dismiss();
      this.setState({ isLoginShow: false });
      Animated.parallel([
        Animated.timing(this.slideValue, {
          toValue: 1,
          duration: animDuration,
        }),
        Animated.timing(this.nativeSlideValue, {
          toValue: 1,
          // eslint-disable-next-line no-underscore-dangle
          duration: animDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  changeToLogin = (override) => {
    const { isLoginShow } = this.state;
    // eslint-disable-next-line no-underscore-dangle
    const animDuration = (slideDuration - minSlideDuration) * (this.slideValue._value) + minSlideDuration;
    if (!isLoginShow || override) {
      Keyboard.dismiss();
      this.setState({ isLoginShow: true });
      Animated.parallel([
        Animated.timing(this.slideValue, {
          toValue: 0,
          // eslint-disable-next-line no-underscore-dangle
          duration: animDuration,
          // useNativeDriver: true,
        }),
        Animated.timing(this.nativeSlideValue, {
          toValue: 0,
          // eslint-disable-next-line no-underscore-dangle
          duration: animDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  togglePassword = (name) => {
    const passState = this.state[name];
    let passwordEmpty;
    switch (name) {
      case 'showPassLogin':
        passwordEmpty = this.state.loginState.password === '';
        break;
      case 'showPassRegister':
        passwordEmpty = this.state.registerState.password === '';
        break;
      case 'showConfirmRegister':
        passwordEmpty = this.state.registerState.confirmpassword === '';
        break;
      default:
        throw new Error('WHY');
    }
    if (!passwordEmpty) this.setState({ [name]: !passState });
  };

  render() {
    const {
      loginHeight,
      registerHeight,
      loginState,
      registerState,
      showPassLogin,
      showPassRegister,
      showConfirmRegister,
    } = this.state;
    const { name, surname } = registerState;
    const { navigation, loading } = this.props;
    units.update();

    const newSlideValue = this.nativeSlideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -ScreenSizeWidth],
    });

    const loginSize = this.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [6 * vw, 5 * vw],
    });

    const registerSize = this.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [5 * vw, 6 * vw],
    });

    const underLinePosition = this.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [ScreenSizeWidth / 10 + 4, 3 * vw + (100 * vw * 5) / 10],
    });

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
          <PanGestureHandler
            onGestureEvent={this.onPanGestureEvent}
            onHandlerStateChange={this.handleStateChange}
          >
            <View style={{ width: 100 * vw }}>
              <View
                style={{
                  marginTop: 30,
                  width: 80 * vw,
                  height: '100%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}
              >
                {/* LOGIN COMPONENT */}
                <Animated.View
                  style={{
                    width: '100%',
                    transform: [{ translateX: newSlideValue }],
                  }}
                >
                  <ScrollView
                    keyboardShouldPersistTaps="always"
                  >
                    <Input
                      keyboardType="email-address"
                      placeholder="Email"
                      inputStyle={styles.inputTextStyle}
                      onChangeText={(text) => {
                        this.setState({
                          loginState: update(loginState, {
                            email: { $set: text },
                          }),
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
                      secureTextEntry={!showPassLogin}
                      placeholder="Password"
                      inputStyle={styles.inputTextStyle}
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
                      leftIcon={{
                        type: 'material',
                        name: 'lock',
                        color: '#AAAAAA',
                      }}
                      rightIcon={(
                        <Icon
                          clear
                          name="remove-red-eye"
                          type="material"
                          color="#AAAAAA"
                          onPress={() => {
                            this.togglePassword('showPassLogin');
                          }}
                        />
)}
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
                        marginTop: 4 * vh,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        alignSelf: 'center',
                      }}
                    >
                      <Text
                        style={{ ...styles.smallLogInText, alignSelf: 'center' }}
                      >
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
                  </ScrollView>
                </Animated.View>
                {/* REGISTER COMPONENT */}
                <Animated.View
                  style={{
                    width: (ScreenSizeWidth * 4) / 5,
                    height: '100%',
                    marginLeft: 80,
                    transform: [{ translateX: newSlideValue }],
                  }}
                >
                  <ScrollView
                    keyboardShouldPersistTaps="always"
                  >
                    <Input
                      placeholder="Name"
                      inputStyle={styles.inputTextStyle}
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
                      inputStyle={styles.inputTextStyle}
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
                      inputStyle={styles.inputTextStyle}
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
                      leftIcon={{
                        type: 'material',
                        name: 'email',
                        color: '#AAAAAA',
                      }}
                    />
                    <View style={{ height: 20 }}>
                      {this.displayErrorMessage('email')}
                    </View>
                    <Input
                      secureTextEntry={!showPassRegister}
                      placeholder="Password"
                      inputStyle={styles.inputTextStyle}
                      onChangeText={(text) => {
                        this.setState({
                          registerState: update(registerState, {
                            password: { $set: text },
                          }),
                        });
                      }}
                      rightIcon={(
                        <Icon
                          clear
                          name="remove-red-eye"
                          type="material"
                          color="#AAAAAA"
                          onPress={() => {
                            this.togglePassword('showPassRegister');
                          }}
                        />
)}
                      onSubmitEditing={() => {
                        this.checkIfValidPasswordAndSet();
                      }}
                      inputContainerStyle={{ ...this.registerStyle.password }}
                      leftIcon={{
                        type: 'material',
                        name: 'lock',
                        color: '#AAAAAA',
                      }}
                    />
                    <View style={{ height: 20 }}>
                      {this.displayErrorMessage('password')}
                    </View>
                    <Input
                      secureTextEntry={!showConfirmRegister}
                      inputStyle={styles.inputTextStyle}
                      placeholder="Confirm Password"
                      onChangeText={(text) => {
                        this.setState({
                          registerState: update(registerState, {
                            tempConfirmedPassword: { $set: text },
                          }),
                        });
                      }}
                      rightIcon={(
                        <Icon
                          clear
                          name="remove-red-eye"
                          type="material"
                          color="#AAAAAA"
                          onPress={() => {
                            this.togglePassword('showConfirmRegister');
                          }}
                        />
)}
                      onSubmitEditing={() => {
                        this.checkIfPasswordsMatchAndSet();
                      }}
                      inputContainerStyle={{
                        ...this.registerStyle.confirmpassword,
                      }}
                      leftIcon={{
                        type: 'material',
                        name: 'lock',
                        color: '#AAAAAA',
                      }}
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
                        marginTop: 4 * vh,
                      }}
                    />

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        alignSelf: 'center',
                      }}
                    >
                      <Text
                        style={{ ...styles.smallLogInText, alignSelf: 'center' }}
                      >
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
                  </ScrollView>
                </Animated.View>
              </View>
            </View>
          </PanGestureHandler>
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

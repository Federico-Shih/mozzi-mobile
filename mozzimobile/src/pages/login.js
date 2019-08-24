// modules
import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';

// codes
import { validateEmail, errorMessages, sendPopup } from '../libraries/helpers';
import { login } from '../libraries/connect/auth';
import styles from '../libraries/styles/styles';
import buttonStyle from '../libraries/styles/buttonsStyles';
import { StyledTitle } from '../libraries/props';
import { LOADING, GET_TOKEN } from '../actions';

type Props = {};

class Login extends Component<Props> {
  state = {
    email: '',
    password: '',
    connection: null,
  };

  error = {
    email: '',
    password: '',
  };

  style = {
    email: styles.inputText,
    password: styles.inputText,
  };

  static propTypes = {
    setLoading: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  // Error and Style handlers
  setErrorState = (incomingJson) => {
    this.error = { ...this.error, ...incomingJson };
    this.forceUpdate();
  };

  setStyle = (incomingStyle) => {
    this.style = { ...this.style, ...incomingStyle };
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

  // Validating inputs
  checkIfValidEmailAndSet = ({ email } = this.state) => new Promise(async (resolve) => {
    if (validateEmail(email)) {
      this.validInput(['email']);
      resolve(true);
    } else {
      this.errorInput([{ key: 'email', message: errorMessages.email }]);
      resolve(false);
    }
  });

  checkIfValidPasswordAndSet = ({ password } = this.state) => new Promise(async (resolve) => {
    if (password.length >= 8) {
      this.validInput(['password']);
      resolve(true);
    } else {
      this.errorInput([{ key: 'password', message: errorMessages.password }]);
      resolve(false);
    }
  });

  checkIfInputIsEmpty = key => new Promise(async (resolve) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (/\s/.test(this.state[key])) {
      this.errorInput([{ key, message: errorMessages[key].spaces }]);
      resolve(false);
      // eslint-disable-next-line react/destructuring-assignment
    } else if (this.state[key]) {
      this.validInput([key]);
      resolve(true);
    } else {
      this.errorInput([{ key, message: errorMessages[key].empty }]);
      resolve(false);
    }
  });

  // Create account function
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
      const { email, password } = this.state;
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
    if (this.error[key]) {
      return (
        <Text
          style={{
            color: 'red',
            paddingLeft: (1 / 10) * Dimensions.get('window').width,
          }}
        >
          {this.error[key]}
        </Text>
      );
    }
    return null;
  };

  // Create account button
  displayCreateButton = () => {
    const { loading } = this.props;
    return (
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
        containerStyle={{ marginTop: '20%', width: '60%', alignSelf: 'center' }}
      />
    );
  };

  // Main render
  render() {
    const { navigation } = this.props;
    return (
      <KeyboardAvoidingView
        style={styles.avoidContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
      >
        <StyledTitle text="Iniciar Sesión" style={styles.logregTitle} />

        <Input
          keyboardType="email-address"
          placeholder="Email"
          onChangeText={(text) => {
            this.setState({ email: text.trim() });
          }}
          onSubmitEditing={() => {
            this.checkIfValidEmailAndSet();
          }}
          inputContainerStyle={{ ...this.style.email, marginTop: 60 }}
          leftIcon={{ type: 'material', name: 'email' }}
        />

        <View style={{ height: 20 }}>{this.displayErrorMessage('email')}</View>

        <Input
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => {
            this.setState({ password: text });
          }}
          onSubmitEditing={() => {
            this.checkIfValidPasswordAndSet();
          }}
          inputContainerStyle={{ ...this.style.password }}
          leftIcon={{ type: 'material', name: 'lock' }}
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
            marginRight: '7%',
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

        <View>{this.displayCreateButton()}</View>

        <View
          style={{ flexDirection: 'row', marginTop: 10, alignSelf: 'center' }}
        >
          <Text style={{ ...styles.smallLogInText, alignSelf: 'center' }}>
            ¿No tienes cuenta?
          </Text>
          <Button
            title="Registrate."
            type="clear"
            titleStyle={styles.smallLogInText}
            containerStyle={{}}
            onPress={() => {
              navigation.replace('Register');
            }}
          />
        </View>

        <View style={{ flex: 1 }} />
      </KeyboardAvoidingView>
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
)(Login);

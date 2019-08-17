// modules
import {
  View, Text, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
// codes
import { validateEmail, errorMessages, sendPopup } from '../libraries/helpers';
import { register } from '../libraries/connect/auth';
import styles from '../libraries/styles/styles';
import buttonStyle from '../libraries/styles/buttonsStyles';
import { StyledTitle, Popup } from '../libraries/props';
import { LOADING, GET_TOKEN } from '../actions';

type Props = {};

class Register extends Component<Props> {
    state = {
      name: '',
      surname: '',
      email: '',
      password: '',
      tempConfirmedPassword: '',
      connection: null,
    };

    error = {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmpassword: '',
    }

    style = {
      name: styles.inputText,
      surname: styles.inputText,
      email: styles.inputText,
      password: styles.inputText,
      confirmpassword: styles.inputText,
    }

    static propTypes = {
      setLoading: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      setToken: PropTypes.func.isRequired,
    }

    // Error and Style handlers
    setErrorState = (incomingJson) => {
      this.error = { ...this.error, ...incomingJson };
      this.forceUpdate();
    }

    setStyle = (incomingStyle) => {
      this.style = { ...this.style, ...incomingStyle };
      this.forceUpdate();
    }

    // Changing colors of the input boxes
    errorInput = (object) => {
      for (let i = 0; i < object.length; i += 1) {
        this.setStyle({ [object[i].key]: { ...styles.inputText, borderColor: 'red' } });
        this.setErrorState({ [object[i].key]: object[i].message });
      }
    };

    validInput = (keyList) => {
      for (let i = 0; i < keyList.length; i += 1) {
        this.setStyle({ [keyList[i]]: styles.inputText });
        this.setErrorState({ [keyList[i]]: '' });
      }
    }

    // Validating inputs
    checkIfValidEmailAndSet = ({ email } = this.state) => (
      new Promise(async (resolve) => {
        if (validateEmail(email)) {
          this.validInput(['email']);
          resolve(true);
        } else {
          this.errorInput([{ key: 'email', message: errorMessages.email }]);
          resolve(false);
        }
      }));

    checkIfValidPasswordAndSet = ({ password } = this.state) => (
      new Promise(async (resolve) => {
        if (password.length >= 8) {
          this.validInput(['password']);
          resolve(true);
        } else {
          this.errorInput([{ key: 'password', message: errorMessages.password }]);
          resolve(false);
        }
      }));

    checkIfPasswordsMatchAndSet = ({ password, tempConfirmedPassword } = this.state) => (
      new Promise(async (resolve) => {
        if (password === tempConfirmedPassword && tempConfirmedPassword && tempConfirmedPassword.length >= 8) {
          this.validInput(['password', 'confirmpassword']);
          resolve(true);
        } else if (!tempConfirmedPassword) {
          this.errorInput([{ key: 'confirmpassword', message: errorMessages.confirmpassword.empty }]);
          resolve(false);
        } else if (tempConfirmedPassword.length < 8) {
          this.errorInput([{ key: 'password', message: errorMessages.password }, { key: 'confirmpassword', message: errorMessages.password }]);
          resolve(false);
        } else {
          this.errorInput([{ key: 'confirmpassword', message: errorMessages.confirmpassword.nomatch }]);
          resolve(false);
        }
      }));

    checkIfInputIsEmpty = key => (
      new Promise(async (resolve) => {
        if (/\s/.test(this.state[key])) {
          this.errorInput([{ key, message: errorMessages[key].spaces }]);
          resolve(false);
        } else if (this.state[key]) {
          this.validInput([key]);
          resolve(true);
        } else {
          this.errorInput([{ key, message: errorMessages[key].empty }]);
          resolve(false);
        }
      }));

    // Create account function
    checkAndRegister = async () => {
      const checkPass = await this.checkIfValidPasswordAndSet();
      const checkMatch = await this.checkIfPasswordsMatchAndSet();
      const checkEmail = await this.checkIfValidEmailAndSet();
      const checkName = await this.checkIfInputIsEmpty('name');
      const checkLastname = await this.checkIfInputIsEmpty('surname');

      if (checkPass && checkMatch && checkEmail && checkName && checkLastname) {
        await this.checkConnectivity();

        const {
          connection, name, surname, email, password,
        } = this.state;

        if (!connection) {
          sendPopup(errorMessages.noConnection);
          return;
        }

        const { setLoading, navigation, setToken } = this.props;

        // calling function
        setLoading(true);
        try {
          const res = await register(name, surname, email, password);
          console.log(res);
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
          console.log(error);
          sendPopup(error.message);
          setLoading(false);
        }
      }
    };


    checkConnectivity = () => (
      new Promise((resolve) => {
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
          NetInfo.isConnected.addEventListener('connectionChange', this.handleFirstConnectivityChange);
          resolve();
        }
      }));


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
          <Text style={{ color: 'red', paddingLeft: 1 / 10 * Dimensions.get('window').width }}>
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
          title="Crear cuenta"
          raised
          type="outline"
          loading={loading}
          onPress={() => { this.checkAndRegister(); }}
          titleStyle={buttonStyle.reglogButtonText}
          buttonStyle={{ ...buttonStyle.reglogButton }}
          containerStyle={{ marginTop: '5%', width: '60%', alignSelf: 'center' }}
        />
      );
    }

    // Main render
    render() {
      const { name, surname } = this.state;
      const { navigation } = this.props;
      return (
        <KeyboardAvoidingView
          style={styles.avoidContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : ''}
          enabled
        >
          <StyledTitle text="Registrate" style={styles.logregTitle} />
          <Input
            placeholder="Name"
            onChangeText={(text) => { this.setState({ name: text }); }}
            value={name}
            inputContainerStyle={{ ...this.style.name, marginTop: 20 }}
            onSubmitEditing={() => { this.checkIfInputIsEmpty('name'); }}
            leftIcon={{ type: 'material', name: 'account-circle' }}
          />
          <View style={{ height: 20 }}>
            {this.displayErrorMessage('name')}
          </View>

          <Input
            placeholder="Surname"
            onChangeText={(text) => { this.setState({ surname: text }); }}
            value={surname}
            inputContainerStyle={{ ...this.style.surname }}
            onSubmitEditing={() => { this.checkIfInputIsEmpty('surname'); }}
            leftIcon={{ type: 'material', name: 'perm-identity' }}
          />
          <View style={{ height: 20 }}>
            {this.displayErrorMessage('surname')}
          </View>

          <Input
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={(text) => { this.setState({ email: text.trim() }); }}
            onSubmitEditing={() => { this.checkIfValidEmailAndSet(); }}
            inputContainerStyle={{ ...this.style.email }}
            leftIcon={{ type: 'material', name: 'email' }}
          />
          <View style={{ height: 20 }}>
            {this.displayErrorMessage('email')}
          </View>

          <Input
            secureTextEntry
            placeholder="Password"
            onChangeText={(text) => { this.setState({ password: text }); }}
            onSubmitEditing={() => { this.checkIfValidPasswordAndSet(); }}
            inputContainerStyle={{ ...this.style.password }}
            leftIcon={{ type: 'material', name: 'lock' }}
          />
          <View style={{ height: 20 }}>
            {this.displayErrorMessage('password')}
          </View>

          <Input
            secureTextEntry
            placeholder="Confirm Password"
            onChangeText={(text) => { this.setState({ tempConfirmedPassword: text }); }}
            onSubmitEditing={() => { this.checkIfPasswordsMatchAndSet(); }}
            inputContainerStyle={{ ...this.style.confirmpassword }}
            leftIcon={{ type: 'material', name: 'lock' }}
          />
          <View style={{ height: 20 }}>
            {this.displayErrorMessage('confirmpassword')}
          </View>

          <View>
            {this.displayCreateButton()}
          </View>

          <View style={{ flexDirection: 'row', marginTop: 10, alignSelf: 'center' }}>
            <Text style={{ ...styles.smallLogInText, alignSelf: 'center' }}>
              ¿Ya tenés una cuenta registrada?
            </Text>
            <Button
              title="Inicia sesión."
              type="clear"
              titleStyle={styles.smallLogInText}
              containerStyle={{}}
              onPress={() => { navigation.replace('Login'); }}
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);

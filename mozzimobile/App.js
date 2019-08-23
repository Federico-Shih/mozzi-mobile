import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import { EventRegister } from 'react-native-event-listeners';

import * as scr from './src/pages/pages';
import reducer from './src/reducer';
import { grantingPermissions } from './src/libraries/helpers';
import { Popup } from './src/libraries/props';

type Props = {};

// Store creation
const store = createStore(reducer);

// Navigation
const AppNavigator = createStackNavigator(
  {
    Main: scr.MainPage,
    Register: scr.Register,
    Login: scr.Login,
    Home: scr.HomePage,
    Forgot: scr.Forgot,
    Recent: scr.Recent,
    Turns: scr.Turns,
    Profile: scr.Profile,
    Config: scr.Config,
    Favs: scr.Favs,
    Business: scr.Business,
    Calendar: scr.CalendarTemp,
    Auth: scr.Auth,
  },
  {
    initialRouteName: 'Auth',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const AppContainer = createAppContainer(AppNavigator);

// Application creation
export default class App extends Component<Props> {
  popupMessage = { title: '', message: '', previousMessage: '' };

  time = '';

  componentDidMount() {
    this.listener = EventRegister.addEventListener('ReceiveMessage', (data) => {
      this.sendPopup('Generic', data);
    });
    this.showPermissionToast();
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  displayPopup = () => {
    if (this.popupMessage.message) {
      return <Popup message={this.popupMessage.message} init />;
    }
    if (!this.popupMessage.message && this.popupMessage.previousMessage) {
      return <Popup message={this.popupMessage.previousMessage} init={false} />;
    }
    return null;
  };

  resetErrorPopup = () => {
    if (this.popupMessage.message !== '') {
      this.popupMessage = { ...this.popupMessage, title: '', message: '' };
      this.forceUpdate();
    }
    if (this.time) {
      clearTimeout(this.time);
    }
  };

  sendPopup = (title, message) => {
    this.popupMessage = {
      title,
      message,
      previousMessage: message,
    };
    this.forceUpdate();
    this.time = setTimeout(this.resetErrorPopup, 2000);
  };

  showPermissionToast = async () => {
    const message = await grantingPermissions();
    this.toast.show(message);
  };

  render() {
    return (
      <Provider store={store}>
        <View
          style={{ flex: 1 }}
          onStartShouldSetResponder={this.resetErrorPopup}
        >
          <AppContainer />
          <Toast
            ref={(el) => {
              this.toast = el;
            }}
            style={{ borderRadius: 100, width: '85%' }}
          />
          <View>{this.displayPopup()}</View>
        </View>
      </Provider>
    );
  }
}

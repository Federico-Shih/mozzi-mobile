import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { View, PermissionsAndroid, Platform } from 'react-native';
import Toast from 'react-native-easy-toast';
import { EventRegister } from 'react-native-event-listeners';
import {
  Icon,
} from 'react-native-elements';

import * as scr from './src/pages/pages';
import reducer from './src/reducer';
import { units } from './src/libraries/helpers';
import { Popup, Menu } from './src/libraries/props';

type Props = {};

// Store creation
const store = createStore(reducer);

const DrawerNavigator = createDrawerNavigator(
  {
    Home: scr.HomePage,
    Recent: scr.Recent,
    Turns: scr.Turns,
    Profile: scr.Profile,
    Favs: scr.Favs,
    Config: scr.Config,
  },
  {
    initialRouteName: 'Home',
    order: ['Home', 'Turns', 'Favs', 'Recent', 'Profile', 'Config'],
    contentComponent: Menu,
    defaultNavigationOptions: {
      header: null,
    },
  },
);

// Navigation
const AppNavigator = createStackNavigator(
  {
    Home: DrawerNavigator,
    Forgot: scr.Forgot,
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

const grantingPermissions = Platform.select({
  ios: () => {},
  android: () => new Promise((resolve) => {
    try {
      PermissionsAndroid.requestMultiple(
        // modificar permisos aca
        [
          PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
          PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
        ],
      ).then((result) => {
        if (
          result['android.permission.READ_CALENDAR']
            && result['android.permission.WRITE_CALENDAR'] === 'granted'
        ) {
          resolve('Thank you very much!');
        } else if (
          result['android.permission.READ_CALENDAR']
            || result['android.permission.WRITE_CALENDAR'] === 'never_ask_again'
        ) {
          resolve(
            'Please Go into Settings -> Applications -> Mozzi -> Permissions and Allow permissions to continue',
          );
        }
      });
    } catch (err) {
      resolve(err);
    }
  }),
});

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
          onLayout={() => {
            units.update();
          }}
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

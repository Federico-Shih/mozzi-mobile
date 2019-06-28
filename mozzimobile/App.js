import React, {Component} from 'react';
import {MainPageScreen, RegisterScreen, LoginScreen, HomePageScreen} from './src/pages/pages.js';

import {createStackNavigator, createAppContainer} from 'react-navigation';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './src/reducer';
import {Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';

type Props = {};

//Store creation
const store = createStore(reducer);

//Grating permissions


const grantingPermissions = Platform.select({
    ios: () => {

    },
    android: async () => {
        try {
            /*
            PermissionsAndroid.requestMultiple(
                //modificar permisos aca
                [PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
                PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR]
                ).then((result) => {
                  if (result['android.permission.READ_CALENDAR']
                  && result['android.permission.WRITE_CALENDAR'] === 'granted') {
                    //avisar que tenes los permisos
                  } else if (result['android.permission.READ_CALENDAR'] || result['android.permission.WRITE_CALENDAR'] === 'never_ask_again') {
                    this.refs.toast.show('Please Go into Settings -> Applications -> Mozzi -> Permissions and Allow permissions to continue');
                  }
                });
            */
        } catch (err) {
            console.warn(err);
        }
    } 
});

//grantingPermissions();

//Navigation
const AppNavigator = createStackNavigator(
    {
        Main: MainPageScreen,
        Register: RegisterScreen,
        Login: LoginScreen,
        Home: HomePageScreen,
    },
    {
        initialRouteName: "Main",
        defaultNavigationOptions: {
            header: null,
        },
    }
);

const AppContainer = createAppContainer(AppNavigator);

//Application creation
export default class App extends Component<Props> {
    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        );
    }
}
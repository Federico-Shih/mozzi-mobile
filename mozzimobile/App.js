import React, {Component} from 'react';
import {MainPageScreen, RegisterScreen, LoginScreen} from './src/pages/pages.js';
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

//NOT YET DONEDONEIT --> hay que agregar tus permisos a Android.xml que seyo y lo mismo para IOS 
//https://stackoverflow.com/questions/54819865/how-do-i-request-multiple-permissions-at-once-in-react-native

const grantingPermissions = Platform.select({
    ios: () => {

    },
    android: async () => {
        try {

        } catch (err) {
            console.warn(err);
        }
    } 
});

//Navigation
const AppNavigator = createStackNavigator(
    {
        Main: MainPageScreen,
        Register: RegisterScreen,
        Login: LoginScreen
    },
    {
        initialRouteName: "Main",
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
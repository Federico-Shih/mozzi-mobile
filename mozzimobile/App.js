import React, {Component} from 'react';
import {MainPageScreen, RegisterScreen, LoginScreen, HomePageScreen, ForgotScreen} from './src/pages/pages.js';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import Toast from 'react-native-easy-toast'

import reducer from './src/reducer';
import {grantingPermissions} from './src/libraries/helpers';

type Props = {};

//Store creation
const store = createStore(reducer);

//Navigation
const AppNavigator = createStackNavigator(
    {
        Main: MainPageScreen,
        Register: RegisterScreen,
        Login: LoginScreen,
        Home: HomePageScreen,
        Forgot: ForgotScreen,
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

    showPermissionToast = async () => {
        let message = await grantingPermissions();
        this.refs.toast.show(message);
    }

    render() {
        this.showPermissionToast();
        return (
            <Provider store={store}>
                <AppContainer />
                <Toast 
                    ref="toast"
                    style = {{borderRadius: 100, width: '85%'}}
                />
            </Provider>
        );
    }
}
import React, {Component} from 'react';
import * as scr from './src/pages/pages.js';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import Toast from 'react-native-easy-toast'

import reducer from './src/reducer';
import {grantingPermissions} from './src/libraries/helpers';

type Props = {};

//Store creation
const store = createStore(reducer);

//Navigation
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
    },
    {
        initialRouteName: "Home",
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
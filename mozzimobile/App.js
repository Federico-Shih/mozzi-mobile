import React, {Component} from 'react';
import {MainPage, Register, Login} from './src/pages/pages.js';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './src/reducers';

type Props = {};

//Store creation
const store = createStore(reducer);

//Navigation
const AppNavigator = createStackNavigator({
    Home: {
        screen: MainPage,
    } 
});

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
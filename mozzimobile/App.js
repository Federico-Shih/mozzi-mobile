import React, {Component} from 'react';
import {MainPage, Register, Login} from './src/pages/pages.js';
import {createStackNavigator, createAppContainer} from 'react-navigation';
//import {createStore} from 'redux';
//import {Provider} from 'react-redux';

type Props = {};

/*
const initialState = {
    currentPage:'initial'
}

const reducer = (state = initialState) => {
    return state;
}

const store = createStore(reducer);

*/
const AppNavigator = createStackNavigator({
    Home: {
        screen: MainPage,
    } 
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component<Props> {
    render() {
        return (
            //<Provider store={store}>
                <AppContainer />
            //</Provider>
        );
    }
}
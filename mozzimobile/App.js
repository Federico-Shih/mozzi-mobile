import React, {Component} from 'react';
import {MainPage, Register, Login} from './src/pages/pages.js';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import { CHANGE_PAGE } from './src/actions'

type Props = {};

const initialState = {
    currentPage:'initial'
}

//Reducer construct
const reducer = (state = initialState, action) => {
    switch(action.type) {
        case CHANGE_PAGE:
            return {...state, currentPage: action.currentPage};
        
        default:
            return state;
    }
}


const store = createStore(reducer);

const AppNavigator = createStackNavigator({
    Home: {
        screen: MainPage,
    } 
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component<Props> {
    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        );
    }
}
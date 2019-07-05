import {Text, View} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import {createDrawerNavigator} from 'react-navigation';
import { Input, Button} from 'react-native-elements';
import * as scr from './pages';

type Props = {};


export default class SidebarMenu extends Component<Props> {
    render() {
        return createDrawerNavigator();
    };
}
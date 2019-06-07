import {Platform, Text, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import styles from './styles/styles';
import {Title, Button} from './src/props';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

export default class App extends Component<Props> {

  state = {
    currentPage: 'initial'
  }

  login = () =>{
    this.setState({currentPage: 'login'});
  }

  register = () =>{
    this.setState({currentPage:'register'});
  }

  render() {
    return (
      <View style={styles.container}>
        <Title text="Mozzi Project"/>

        <Text style={styles.textTest}>
            {this.state.currentPage}
        </Text>

        <View style={{flexDirection: 'column', justifyContent:'space-around', top:80}}>
          <Button onPress={()=>this.login()} text="Login" fontSize={30}/>
          <Button onPress={()=>this.register()} text="Register" fontSize={30}/>
        </View>
      </View>
    );
  }
}

import {Text, View} from 'react-native';
import React, {Component} from 'react';
import styles from '../styles/styles';
import {Title, Button} from '../props';

type Props = {};

export default class MainPage extends Component<Props> {

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
            <Button hitSlop={{top:10, bottom:10, left:40, right:40}} onPress={()=>this.login()} text="Login" fontSize={30}/>
            <Button hitSlop={{top:10, bottom:10, left:40, right:40}} onPress={()=>this.register()} text="Register" fontSize={30}/>
          </View>
        </View>
      );
    }
  }


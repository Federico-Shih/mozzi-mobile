import {Text, View} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import { Input, Button, Header, Icon} from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {};

export default class Register extends Component<Props> {
    state = {
      
   }
    render() {
      return (
        <View style={styles.container}>
            <Header
                leftComponent=
                {
                  <Button 
                      containerStyle = {{bottom: '50%'}}
                      icon = {
                            <Icon
                                name="menu"
                                size={30}
                            />
                          }
                      type = 'clear'
                      onPress = {() => {}}
                      />
                }
                containerStyle= {{height: '7%', backgroundColor: '#F5FCFF', borderWidth: 0}}
                centerComponent= {{text: 'Mozzi', style: {bottom: '50%', fontSize: 25}}}
                placement= 'left'
            />
            <ScrollView style= {{width: '100%'}}>
               {
                  
               }
            </ScrollView>
            
        </View>
      );
    }
}

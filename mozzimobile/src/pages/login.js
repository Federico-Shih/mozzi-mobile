import {Text, View} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import {Title, Button} from '../libraries/props';

type Props = {};

class Register extends Component<Props> {
    render() {
      return (
        <View style={styles.container}>
           <Text style={styles.textTest}>
                Login
          </Text>
          <View style = {{alignSelf: 'stretch', marginBottom: '0%', justifyContent: 'flex-end', flex: 1}}>         
              <Button styles={styles.backButton} text="Back" onPress = {()=> { this.props.navigation.goBack()}} />
           </View>
        </View>
      );
    }
}

export default Register;

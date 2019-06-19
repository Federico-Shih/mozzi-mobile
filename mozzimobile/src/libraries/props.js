import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import React, {Component} from 'react';
import { Icon } from 'react-native-elements';
import styles from './styles/styles';

type Props = {};

class TitleProp extends Component<Props> {
    render() {
        return (
          <Text style={styles.title}>
            {this.props.text}
          </Text>
        );
    }
};


class ButtonProp extends Component<Props> {
    render() {
        return(
            <TouchableOpacity onPress={this.props.onPress} hitSlop={this.props.hitSlop} style={{margin:5}}>
                <Text style={this.props.styles}>
                  {this.props.text}
                </Text>
            </TouchableOpacity>
        );
    }
};

/*
<Icon
                    name='person'
                    type='material'
                    color='#517fa4'
                />
*/
class InputProp extends Component<Props> {
    render() {
        return(
            <View>
              
                
              
                <TextInput 
                    style= {this.props.style} 
                    placeholder= {this.props.placeholder}
                    onChangeText={this.props.onChangeText}
                    value = {this.props.username}
                    secureTextEntry = {this.props.secureTextEntry}
                    keyboardType = {this.props.keyboardType = 'default'}
                />
            </View>
            
        );
    }
}

export const InputWithIcon = InputProp;
export const Title = TitleProp;
export const Button = ButtonProp;
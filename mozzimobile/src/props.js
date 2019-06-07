import {Text, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import styles from '../styles/styles';

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
        <TouchableOpacity onPress={this.props.onPress} style = {{margin:5}}>
            <Text style={{fontSize: this.props.fontSize, textAlign: 'center'}}>
              {this.props.text}
            </Text>
          </TouchableOpacity>
      );
    }
};

export const Title = TitleProp;
export const Button = ButtonProp;
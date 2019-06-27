import {View, Text, TouchableOpacity, TextInput, Animated} from 'react-native';
import React, {Component} from 'react';
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


class LogRegTitleProp extends Component<Props> {
    render() {
        return(
            <View style= {{alignSelf: 'flex-start'}}>
                <Text style={this.props.style}>
                    {this.props.text}
                </Text>
            </View>
        );
    }
}

class InputProp extends Component<Props> {
    render() {
        return(
            <View style = {{width: '100%', alignItems:'center', margin: 10}}>
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

const popupDuration = 200;

export class Popup extends Component<Props> {

    state = {
        anim: (this.props.init) ? new Animated.Value(-50) : new Animated.Value(20), 
    }

    componentDidMount() {
        if (this.props.init) {
            Animated.timing(
                this.state.anim, 
                {
                    toValue: 20,
                    duration: popupDuration,
                }
            ).start();
        } 
    }

    componentDidUpdate(prevProps) {
        if(this.props.init !== prevProps.init){
            if (this.props.init) {
                Animated.timing(
                    this.state.anim, 
                    {
                        toValue: 20,
                        duration: popupDuration,
                    }
                ).start();
            } else {
                Animated.timing(
                    this.state.anim,
                    {
                        toValue: -50,
                        duration: popupDuration,
                    }
                ).start();
            }
        }
    }

    render() {
        let { anim } = this.state;

        return(
            <Animated.View style={{...styles.popup, bottom: anim, }}>
                <View style= {{height: '100%', backgroundColor: 'red', width: 10}}></View>
                <Text style ={{paddingLeft: 20, fontSize: 15}}>{this.props.message}</Text>
            </Animated.View>
        );
    }
}

export const InputWithIcon = InputProp;
export const Title = TitleProp;
export const Button = ButtonProp;
export const StyledTitle = LogRegTitleProp;
import {Text, View, TextInput} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import {Title, Button} from '../libraries/props';
import {ADD_REGISTER, REGISTER_JSON} from '../actions';
import DatePicker from 'react-native-datepicker'


type Props = {};
const date = (new Date()).toISOString().split('T')[0];

export default class Register extends Component<Props> {
    constructor(props){
        super(props);
    }

    state = {
        username: '',
        date: date,
        email: '',
        password: ''
    };
    
    render() {
        return (
                <View style={styles.container}>
                    <View style = {{flex: 1}}>
                        <Text style={styles.textTest}>
                            Register
                        </Text>
                    </View>
    
                    <View style = {{width: '80%', alignContent:'center', alignItems: 'center', flex: 4}}>
                        <TextInput 
                            style= {{width: '80%', backgroundColor: '#FFFFFF', margin: 20}} 
                            placeholder= 'Username' 
                            onChangeText={(text) => {this.setState({username: text})}}
                            value = {this.state.username}
                            />
                        <DatePicker
                            style={{width: '80%'}}
                            date={this.state.date}
                            mode="date"
                            placeholder="select birthday"
                            format="YYYY-MM-DD"
                            maxDate= {date}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                        marginLeft: 0
                                }
                            }} 
                            onDateChange={(date) => {this.setState({date: date})}}

                            />
                        <TextInput keyboardType='email-address' style= {{width: '80%', backgroundColor: '#FFFFFF', margin: 20}} placeholder= 'e-mail address' />
                        <TextInput secureTextEntry= {true} style= {{width: '80%', backgroundColor: '#FFFFFF'}} placeholder= 'password' />

                    </View>
                    <View style = {{alignSelf: 'stretch', marginBottom: '0%', justifyContent: 'flex-end', flex: 1}}>         
                        <Button styles={styles.backButton} text="Back" onPress = {()=> { this.props.navigation.goBack()}} />
                    </View>
                </View>
        );
    }
}


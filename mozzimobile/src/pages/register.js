import {Text, View, Dimensions, KeyboardAvoidingView} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import buttonStyle from '../libraries/styles/buttonsStyles';
import {StyledTitle} from '../libraries/props';
import { LOGGING_IN } from '../actions';
import {connect} from 'react-redux';
import { Input, Button} from 'react-native-elements';


type Props = {};
const date = (new Date()).toISOString().split('T')[0];

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const InputTextWidth = (Math.round((1 - 60/Dimensions.get('window').width)*100)).toString() + '%';

class Register extends Component<Props> {
    constructor(props){
        super(props);
    }

    //ACORDATE DE MOVER ESTOS ESTILOS A STYLESHEET ASI NO SE VUELVE REPETITIVO
    state = {
        name: '',
        surname: '',
        email: '',
        password: '',
        tempConfirmedPassword: '',
        style: {
            name: styles.inputText,
            surname: styles.inputText,
            email: styles.inputText,
            password: styles.inputText,
            confirmpassword: styles.inputText
        }
    }; 
    
    errorInput = (key) => {
        this.setState({style: {...this.state.style, [key]: {...styles.inputText, borderColor: 'red'}}})
    };

    checkIfValidEmailAndSet = (text = this.state.email) => {
        if(validateEmail(text)) {
            this.setState({email: text});
            this.setState({style: {...this.state.style, email: styles.inputText}});
            return true;
        } else {
            this.errorInput('email');
        }
    };

    checkIfValidPasswordAndSet = (text = this.state.password) => {
        if(text.length >= 8) {
            this.setState({password: text});
            this.setState({style: {...this.state.style, password: styles.inputText}});
            return true;
        } else {
            this.errorInput('password');
        }
    };

    checkIfPasswordsMatchAndSet = (t1 = this.state.password, t2 = this.state.tempConfirmedPassword) => {
        if(t1 === t2 && t2) {
            this.setState({password: t1});
            this.setState({style: {...this.state.style, confirmpassword: styles.inputText}});
            return true;
        } else {
            this.errorInput('confirmpassword');
        }
    };

    checkAndRegister = (name = this.state.surname, surname = this.state.surname) => {
        let email = this.checkIfValidEmailAndSet();
        let password = this.checkIfPasswordsMatchAndSet();
        if (name && surname && email && password){
            //register
        }
        if (!name) {
            this.errorInput('name');
        }
        if(!surname) {
            this.errorInput('surname');
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                        <StyledTitle text='Registrate' style={styles.logregTitle} />

                        <View style = {{width: InputTextWidth, alignContent:'center', alignItems: 'center', flex: 10, marginTop: '5%'}}>
                            <Input 
                                placeholder= 'Name' 
                                onChangeText={(text) => {this.setState({name: text})}}
                                value = {this.state.name}
                                inputContainerStyle={this.state.style.name}
                                leftIcon = {{ type: 'material', name: 'account-circle'}} 
                                />

                            <Input 
                                placeholder= 'Surname' 
                                onChangeText={(text) => {this.setState({surname: text})}}
                                value = {this.state.surname}
                                inputContainerStyle={this.state.style.surname}
                                leftIcon = {{ type: 'material', name: 'perm-identity'}} 
                                />

                            <Input 
                                keyboardType='email-address' 
                                placeholder= 'Email'
                                onChangeText={(text) => {this.setState({email: text})}}
                                onSubmitEditing= {()=> {this.checkIfValidEmailAndSet()}}
                                inputContainerStyle={this.state.style.email}
                                leftIcon = {{ type: 'material', name: 'email'}} 
                                />

                            <Input 
                                secureTextEntry= {true} 
                                placeholder= 'Password' 
                                onChangeText={(text) => {this.setState({password: text})}}
                                onSubmitEditing= {()=> {this.checkIfValidPasswordAndSet()}}
                                inputContainerStyle={this.state.style.password}
                                leftIcon = {{ type: 'material', name: 'lock'}} 
                                />
                            
                            <Input 
                                secureTextEntry= {true} 
                                placeholder= 'Confirm Password' 
                                onChangeText={(text) => {this.setState({tempConfirmedPassword: text})}}
                                onSubmitEditing= {()=> {this.checkIfPasswordsMatchAndSet()}}
                                inputContainerStyle={this.state.style.confirmpassword}
                                leftIcon = {{ type: 'material', name: 'lock'}} 
                                />
                            
                            <Button 
                                title="Crear cuenta"
                                raised
                                type="outline"
                                onPress= {()=> {this.checkAndRegister()}}
                                titleStyle= {buttonStyle.reglogButtonText}
                                buttonStyle= {buttonStyle.reglogButton}
                                containerStyle= {{top: '5%'}}
                                />
                            
                        </View>
                        <View style = {{alignSelf: 'stretch', marginBottom: '0%', justifyContent: 'flex-end', flex: 1}}>         
                            <Button 
                                title="Back" 
                                onPress = {()=> { this.props.navigation.goBack()}} 
                                type= 'clear'
                                titleStyle= {{fontSize:25}}
                                />
                        </View>
                    
            </KeyboardAvoidingView>
                
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading,
        loggedIn: state.loggedIn,
    }
}


function mapDispatchToProps(dispatch) {
    return {
        changeLogInState: (isLoggedIn) => {
            dispatch({
                type: LOGGING_IN,
                login: isLoggedIn
            });
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
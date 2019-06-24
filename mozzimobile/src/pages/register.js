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
        return new Promise(resolve => {
            this.setState({style: {...this.state.style, [key]: {...styles.inputText, borderColor: 'red'}}});
            resolve();
        });
    };

    validInput = (key, text) => {
        return new Promise(resolve => {
            this.setState({[key]: text});
            this.setState({style: {...this.state.style, [key]: styles.inputText}});
            resolve();
        });
    }

    checkIfValidEmailAndSet = (text = this.state.email) => {
        return new Promise(async resolve => {
            if(validateEmail(text)) {
                await this.validInput('email', text);
                resolve();
            } else {
                await this.errorInput('email');
                resolve();
            }
        });
    };

    checkIfValidPasswordAndSet = (text = this.state.password) => {
        return new Promise(async resolve =>{
            if(text.length >= 8) {
                await this.validInput('password', text);
                resolve();
            } else {
                await this.errorInput('password');
                resolve();
            }
        });
    };

    checkIfPasswordsMatchAndSet = (t1 = this.state.password, t2 = this.state.tempConfirmedPassword) => {
        return new Promise(async resolve =>{
            if(t1 === t2 && t2) {
                await this.validInput('password', t1);
                await new Promise((resolve => {
                    this.setState({style: {...this.state.style, 'confirmpassword': styles.inputText}});
                    resolve();
                }));
                resolve();
            } else {
                await this.errorInput('confirmpassword');
                resolve();
            }
        });
    };

    checkAndRegister = async (name = this.state.name, surname = this.state.surname, pass = this.state.password, confp = this.state.tempConfirmedPassword, email = this.state.email) => {
        await this.checkIfValidPasswordAndSet();
        await this.checkIfPasswordsMatchAndSet();
        await this.checkIfValidEmailAndSet();

        if (name && surname && email && pass){
            await this.validInput('name', name);
            await this.validInput('surname', surname);
        } 
        if (!name) {
            await this.errorInput('name');
        }
        if(!surname) {
            await this.errorInput('surname');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StyledTitle text='Registrate' style={styles.logregTitle} />

                <View style = {{width: InputTextWidth, alignContent:'center', alignItems: 'center', marginTop: '5%'}}>
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
                        onSubmitEditing= {() => {this.checkIfValidPasswordAndSet()}}
                        inputContainerStyle={this.state.style.password}
                        leftIcon = {{ type: 'material', name: 'lock'}} 
                        />
                    
                    <Input 
                        secureTextEntry= {true} 
                        placeholder= 'Confirm Password' 
                        onChangeText={(text) => {this.setState({tempConfirmedPassword: text})}}
                        onSubmitEditing= {() => {this.checkIfPasswordsMatchAndSet()}}
                        inputContainerStyle={this.state.style.confirmpassword}
                        leftIcon = {{ type: 'material', name: 'lock'}} 
                        />
                </View>
                <Button 
                    title="Crear cuenta"
                    raised
                    type="outline"
                    onPress= {()=> {this.checkAndRegister()}}
                    titleStyle= {buttonStyle.reglogButtonText}
                    buttonStyle= {buttonStyle.reglogButton}
                    containerStyle= {{marginTop:'5%'}}
                    />         
            </View>
                
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
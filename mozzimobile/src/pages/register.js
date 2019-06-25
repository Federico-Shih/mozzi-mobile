import {View, Text, Dimensions, KeyboardAvoidingView, Platform} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import buttonStyle from '../libraries/styles/buttonsStyles';
import {StyledTitle} from '../libraries/props';
import {LOADING} from '../actions';
import {connect} from 'react-redux';
import { Input, Button} from 'react-native-elements';
import {validateEmail} from '../libraries/helpers';
import {register} from '../libraries/connect/auth';

type Props = {};

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
    
    error = {
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmedpassword: ''
    }
    
    setErrorState = (incomingJson) => {
        error = {...this.error, incomingJson};
    }


    //Changing colors of the input boxes
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

    //Validating inputs
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

    checkIfInputIsEmpty = (key) => {
        return new Promise(async resolve => {
            if (this.state[key]) {
                await this.validInput(key, this.state[key]);
            } else {
                await this.errorInput(key);
            }
        });
    };

    //Create account function
    checkAndRegister = async (name = this.state.name, surname = this.state.surname, pass = this.state.password, confp = this.state.tempConfirmedPassword, email = this.state.email) => {
        await this.checkIfValidPasswordAndSet();
        await this.checkIfPasswordsMatchAndSet();
        await this.checkIfValidEmailAndSet();

        if (name && surname && email && pass){
            await this.validInput('name', name);
            await this.validInput('surname', surname);

            //calling function
            this.props.setLoading(true);
            let authResult = await register(this.state.name, this.state.surname, this.state.email, this.state.password); 
        
            this.props.setLoading(false);
            console.log(authResult);
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
            <KeyboardAvoidingView style={styles.avoidContainer} behavior={Platform.OS === 'ios' ? 'padding':''} enabled>
                <StyledTitle text='Registrate' style={styles.logregTitle} />
                <Input 
                    placeholder= 'Name' 
                    onChangeText={(text) => {this.setState({name: text})}}
                    value = {this.state.name}
                    inputContainerStyle={{...this.state.style.name, width: InputTextWidth, alignSelf:'center', marginTop:20}}
                    onSubmitEditing= {() => {this.checkIfInputIsEmpty('name')}}
                    leftIcon = {{ type: 'material', name: 'account-circle'}} 
                    />
                <Input 
                    placeholder= 'Surname' 
                    onChangeText={(text) => {this.setState({surname: text})}}
                    value = {this.state.surname}
                    inputContainerStyle={{...this.state.style.name, width: InputTextWidth, alignSelf:'center'}}
                    onSubmitEditing= {() => {this.checkIfInputIsEmpty('surname')}}
                    leftIcon = {{ type: 'material', name: 'perm-identity'}} 
                    />

                <Input 
                    keyboardType='email-address' 
                    placeholder= 'Email'
                    onChangeText={(text) => {this.setState({email: text})}}
                    onSubmitEditing= {()=> {this.checkIfValidEmailAndSet()}}
                    inputContainerStyle={{...this.state.style.name, width: InputTextWidth, alignSelf:'center'}}
                    leftIcon = {{ type: 'material', name: 'email'}} 
                    />

                <Input 
                    secureTextEntry= {true} 
                    placeholder= 'Password' 
                    onChangeText={(text) => {this.setState({password: text})}}
                    onSubmitEditing= {() => {this.checkIfValidPasswordAndSet()}}
                    inputContainerStyle={{...this.state.style.name, width: InputTextWidth, alignSelf:'center'}}
                    leftIcon = {{ type: 'material', name: 'lock'}} 
                    />
                
                <Input 
                    secureTextEntry= {true} 
                    placeholder= 'Confirm Password' 
                    onChangeText={(text) => {this.setState({tempConfirmedPassword: text})}}
                    onSubmitEditing= {() => {this.checkIfPasswordsMatchAndSet()}}
                    inputContainerStyle={{...this.state.style.name, width: InputTextWidth, alignSelf:'center'}}
                    leftIcon = {{ type: 'material', name: 'lock'}} 
                    />
                <Button 
                    title="Crear cuenta"
                    raised
                    type="outline"
                    onPress= {()=> {this.checkAndRegister()}}
                    titleStyle= {buttonStyle.reglogButtonText}
                    buttonStyle= {{...buttonStyle.reglogButton}}
                    containerStyle= {{marginTop:'5%', width: '60%', alignSelf:'center', width: '70%'}}
                    /> 
                
                <View style = {{flexDirection: 'row', marginTop: 10, alignSelf: 'center'}}>
                    <Text style={{...styles.smallLogInText, alignSelf:'center'}}>
                        ¿Ya tenés una cuenta registrada?
                    </Text>
                    <Button
                        title= "Inicia sesión."
                        type="clear"
                        titleStyle={styles.smallLogInText}
                        containerStyle={{}}
                        onPress={() => {this.props.navigation.navigate('Login')}}
                        />
                </View>
                <View style={{flex:1}}/> 
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
        setLoading: (isLoading) => {
            dispatch({
                type: LOADING,
                loading: isLoading,
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
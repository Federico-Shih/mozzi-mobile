//modules
import {View, Text, Dimensions, KeyboardAvoidingView, Platform} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Input, Button} from 'react-native-elements';

//codes
import {validateEmail} from '../libraries/helpers';
import {register} from '../libraries/connect/auth';
import styles from '../libraries/styles/styles';
import buttonStyle from '../libraries/styles/buttonsStyles';
import {StyledTitle, Popup} from '../libraries/props';
import {LOADING} from '../actions';
import errorCodes from '../libraries/codes'

type Props = {};

const InputTextWidth = (Math.round((1 - 40/Dimensions.get('window').width)*100)).toString() + '%';

const errorMessages = {
    name: {
        empty: 'No haz ingresado un nombre.',
        spaces: 'Tu nombre contiene espacios.',
    },
    surname: {
        empty: 'No haz ingresado un apellido.',
        spaces: 'Tu apellido contiene espacios.',
    },
    email: 'El e-mail no es válido.',
    password: 'La contraseña es menor a 8 carácteres.',
    confirmpassword: {
        nomatch: 'Las contraseñas no coinciden.',
        empty: 'No haz ingresado la confirmación de tu contraseña.',
    }   
}

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
    }; 
    
    error = {
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmpassword: ''
    }
    
    style = {
        name: styles.inputText,
        surname: styles.inputText,
        email: styles.inputText,
        password: styles.inputText,
        confirmpassword: styles.inputText
    }

    setErrorState = (incomingJson) => {
        this.error = {...this.error, ...incomingJson};
        this.forceUpdate();
    }

    setStyle = (incomingStyle) => {
        this.style = {...this.style, ...incomingStyle};
        this.forceUpdate();
    }

    //Changing colors of the input boxes
    errorInput = (key, errorMessage) => {
        return new Promise(resolve => {
            this.setStyle({[key]: {...styles.inputText, borderColor: 'red'}});
            this.setErrorState({[key]: errorMessage});
            resolve();
        });
    };

    validInput = (key) => {
        return new Promise(resolve => {
            this.setStyle({[key]: styles.inputText});
            this.setErrorState({[key]: ''});
            resolve();
        });
    }

    //Validating inputs
    checkIfValidEmailAndSet = (text = this.state.email) => {
        return new Promise(async resolve => {
            if(validateEmail(text)) {
                await this.validInput('email');
                resolve(true);
            } else {
                await this.errorInput('email', errorMessages.email);
                resolve(false);
            }
        });
    };

    checkIfValidPasswordAndSet = (text = this.state.password) => {
        return new Promise(async resolve =>{
            if(text.length >= 8) {
                await this.validInput('password');
                resolve(true);
            } else {
                await this.errorInput('password', errorMessages.password);
                resolve(false);
            }
        });
    };

    checkIfPasswordsMatchAndSet = (t1 = this.state.password, t2 = this.state.tempConfirmedPassword) => {
        return new Promise(async resolve =>{
            if(t1 === t2 && t2) {
                await this.validInput('password');
                await this.validInput('confirmpassword');
                resolve(true);
            } else if (!t2) {
                await this.errorInput('confirmpassword', errorMessages.confirmpassword.empty);
                resolve(false);
            } else {
                await this.errorInput('confirmpassword', errorMessages.confirmpassword.nomatch);
                resolve(false);
            }
        });
    };

    checkIfInputIsEmpty = (key) => {
        return new Promise(async resolve => {
            if(/\s/.test(this.state[key])){
                await this.errorInput(key, errorMessages[key].spaces);
                resolve(false);
            }  else if (this.state[key]) {
                await this.validInput(key);
                resolve(true);
            } else {
                await this.errorInput(key, errorMessages[key].empty);
                resolve(false);
            }
        });
    };

    //Create account function
    checkAndRegister = async (name = this.state.name, surname = this.state.surname, pass = this.state.password, email = this.state.email) => {
        let checkPass = await this.checkIfValidPasswordAndSet();
        let checkMatch = await this.checkIfPasswordsMatchAndSet();
        let checkEmail = await this.checkIfValidEmailAndSet();
        let checkName = await this.checkIfInputIsEmpty('name');
        let checkLastname = await this.checkIfInputIsEmpty('surname');

        if (checkPass && checkMatch && checkEmail && checkName && checkLastname){
            
            //calling function
            this.props.setLoading(true);
            let response = await register(this.state.name, this.state.surname, this.state.email, this.state.password); 
            this.props.setLoading(false);

            switch (response.data.code) {
                case 'duplicateAccount':
                    this.sendPopup('Duplicate account','Esta cuenta ya fue creada');
                    return;
                case 500:
                    this.sendPopup('Server errors','Hubo un problema del servidor');
                    return;
            }

            //Save JWT and navigate to homepage
            
            //console.log(authResult);
        } 
    };

    //Popup Section
    popupMessage = {title: '', message: '', previousMessage: ''};

    displayPopup = () => {
        if (this.popupMessage.message) {
            return <Popup message={this.popupMessage.message} init/>
        } else if(!this.popupMessage.message && this.popupMessage.previousMessage) {
            return <Popup message={this.popupMessage.previousMessage} init = {false}/>
        } else {
            return null;
        }
    };

    resetErrorPopup = () => {
        this.popupMessage = {...this.popupMessage, title: '', message: ''};
        this.forceUpdate();
        
    }

    sendPopup = (title, message) => {
        this.popupMessage = {title: title, message: message, previousMessage: message};
        this.forceUpdate();
        setTimeout(this.resetErrorPopup, 2000);
    }

    //Input Error section
    displayErrorMessage = (key) => {
        if (this.error[key])
        {
            return <Text style={{color: 'red',paddingLeft: 1/10*Dimensions.get('window').width}}>
                            {this.error[key]}
                    </Text>
        } else {
            return null;
        }
    };

    render() {
        return (
            <KeyboardAvoidingView style={styles.avoidContainer} behavior={Platform.OS === 'ios' ? 'padding':''} enabled onStartShouldSetResponder = {() => {
                this.resetErrorPopup();
            }}>
                <StyledTitle text='Registrate' style={styles.logregTitle} />
                <Input 
                    placeholder= 'Name' 
                    onChangeText={(text) => {this.setState({name: text})}}
                    value = {this.state.name}
                    inputContainerStyle={{...this.style.name, width: InputTextWidth, alignSelf:'center', marginTop:20}}
                    onSubmitEditing= {() => {this.checkIfInputIsEmpty('name')}}
                    leftIcon = {{ type: 'material', name: 'account-circle'}} 
                    />
                <View style= {{height: 20}}>
                    {this.displayErrorMessage('name')}
                </View>

                <Input 
                    placeholder= 'Surname' 
                    onChangeText={(text) => {this.setState({surname: text})}}
                    value = {this.state.surname}
                    inputContainerStyle={{...this.style.surname, width: InputTextWidth, alignSelf:'center'}}
                    onSubmitEditing= {() => {this.checkIfInputIsEmpty('surname')}}
                    leftIcon = {{ type: 'material', name: 'perm-identity'}} 
                    />
                <View style= {{height: 20}}>
                    {this.displayErrorMessage('surname')}
                </View>

                <Input 
                    keyboardType='email-address' 
                    placeholder= 'Email'
                    onChangeText={(text) => {this.setState({email: text.trim()})}}
                    onSubmitEditing= {()=> {this.checkIfValidEmailAndSet()}}
                    inputContainerStyle={{...this.style.email, width: InputTextWidth, alignSelf:'center'}}
                    leftIcon = {{ type: 'material', name: 'email'}} 
                    />
                <View style= {{height: 20}}>
                    {this.displayErrorMessage('email')}
                </View>

                <Input 
                    secureTextEntry= {true} 
                    placeholder= 'Password' 
                    onChangeText={(text) => {this.setState({password: text})}}
                    onSubmitEditing= {() => {this.checkIfValidPasswordAndSet()}}
                    inputContainerStyle={{...this.style.password, width: InputTextWidth, alignSelf:'center'}}
                    leftIcon = {{ type: 'material', name: 'lock'}} 
                    />
                <View style= {{height: 20}}>
                    {this.displayErrorMessage('password')}
                </View>                

                <Input 
                    secureTextEntry= {true} 
                    placeholder= 'Confirm Password' 
                    onChangeText={(text) => {this.setState({tempConfirmedPassword: text})}}
                    onSubmitEditing= {() => {this.checkIfPasswordsMatchAndSet()}}
                    inputContainerStyle={{...this.style.confirmpassword, width: InputTextWidth, alignSelf:'center'}}
                    leftIcon = {{ type: 'material', name: 'lock'}} 
                    />
                <View style= {{height: 20}}>
                    {this.displayErrorMessage('confirmpassword')}
                </View>

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

                {/*Popup component*/}
                <View>
                    {this.displayPopup()}
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
        setLoading: (isLoading) => {
            dispatch({
                type: LOADING,
                loading: isLoading,
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
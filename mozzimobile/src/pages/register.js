//modules
import {View, Text, Dimensions, KeyboardAvoidingView, Platform} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Input, Button} from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';

//codes
import {validateEmail, errorMessages} from '../libraries/helpers';
import {register} from '../libraries/connect/auth';
import styles from '../libraries/styles/styles';
import buttonStyle from '../libraries/styles/buttonsStyles';
import {StyledTitle, Popup} from '../libraries/props';
import {LOADING, GET_TOKEN} from '../actions';

type Props = {};

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
        connection: null,
    }; 
    
    error = {
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmpassword: '',
    }
    
    style = {
        name: styles.inputText,
        surname: styles.inputText,
        email: styles.inputText,
        password: styles.inputText,
        confirmpassword: styles.inputText,
    }

    //Error and Style handlers
    setErrorState = (incomingJson) => {
        this.error = {...this.error, ...incomingJson};
        this.forceUpdate();
    }

    setStyle = (incomingStyle) => {
        this.style = {...this.style, ...incomingStyle};
        this.forceUpdate();
    }

    //Changing colors of the input boxes
    errorInput = (object) => {
        for (let i = 0; i < object.length; i++) {
            this.setStyle({[object[i].key]: {...styles.inputText, borderColor: 'red'}});
            this.setErrorState({[object[i].key]: object[i].message});
        }
    };

    validInput = (keyList) => {
        for (let i = 0; i < keyList.length; i++) {
            this.setStyle({[keyList[i]]: styles.inputText});
            this.setErrorState({[keyList[i]]: ''});
        }
    }

    //Validating inputs
    checkIfValidEmailAndSet = (text = this.state.email) => {
        return new Promise(async resolve => {
            if(validateEmail(text)) {
                this.validInput(['email']);
                resolve(true);
            } else {
                this.errorInput([{key:'email', message: errorMessages.email}]);
                resolve(false);
            }
        });
    };

    checkIfValidPasswordAndSet = (text = this.state.password) => {
        return new Promise(async resolve =>{
            if(text.length >= 8) {
                this.validInput(['password']);
                resolve(true);
            } else {
                this.errorInput([{key:'password', message: errorMessages.password}]);
                resolve(false);
            }
        });
    };

    checkIfPasswordsMatchAndSet = (t1 = this.state.password, t2 = this.state.tempConfirmedPassword) => {
        return new Promise(async resolve =>{
            if(t1 === t2 && t2) {
                this.validInput(['password', 'confirmpassword']);
                resolve(true);
            } else if (!t2) {
                this.errorInput([{key:'confirmpassword', message: errorMessages.confirmpassword.empty}]);
                resolve(false);
            } else {
                this.errorInput([{key:'confirmpassword', message: errorMessages.confirmpassword.nomatch}]);
                resolve(false);
            }
        });
    };

    checkIfInputIsEmpty = (key) => {
        return new Promise(async resolve => {
            if(/\s/.test(this.state[key])){
                this.errorInput([{key: key, message: errorMessages[key].spaces}]);
                resolve(false);
            }  else if (this.state[key]) {
                this.validInput([key]);
                resolve(true);
            } else {
                this.errorInput([{key: key, message: errorMessages[key].empty}]);
                resolve(false);
            }
        });
    };

    //Create account function
    checkAndRegister = async () => {
        let checkPass = await this.checkIfValidPasswordAndSet();
        let checkMatch = await this.checkIfPasswordsMatchAndSet();
        let checkEmail = await this.checkIfValidEmailAndSet();
        let checkName = await this.checkIfInputIsEmpty('name');
        let checkLastname = await this.checkIfInputIsEmpty('surname');

        if (checkPass && checkMatch && checkEmail && checkName && checkLastname){
            
            await this.checkConnectivity();

            if(!this.state.connection) {
                this.sendPopup('Intenet connection failure', errorMessages.noConnection);
                return;
            }

            //calling function
            this.props.setLoading(true);
            let response = await register(this.state.name, this.state.surname, this.state.email, this.state.password); 
            

            if (response.data) {
                switch (response.data.code) {
                    case 'duplicateAccount':
                        this.sendPopup('Duplicate account', errorMessages.duplicateAccount);
                        return;
                    case 500:
                        this.sendPopup('Server errors', errorMessages.internalServerError);
                        return;
                }
    
                if(response.headers.connection == 'Close') {
                    this.sendPopup('Certificate failure', errorMessages.certificateError);
                    return;
                }
    
                if (response.data.code === 0) {
                    this.props.setToken(response.data.token);
                    this.props.navigation.navigate('Home');
                }
            } else {
                this.sendPopup('Device error', response);
            }


            this.props.setLoading(false);
        } 
    };


    checkConnectivity = () => {
        return new Promise(resolve => {
            if (Platform.OS === 'android') {
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.setState({connection: true});
                        resolve();
                    } else {
                        this.sendPopup('Not connected', errorMessages.noConnection);
                        this.setState({connection: false});
                        resolve();
                    }
                });
            } else {
                NetInfo.isConnected.addEventListener('connectionChange', this.handleFirstConnectivityChange);
                resolve();
            }
        });
    }

    handleFirstConnectivityChange = isConnected => {
        NetInfo.isConnected.removeEventListener(
            'connectionChange', 
            this.handleFirstConnectivityChange
        );

        if (isConnected === false) { 
            this.setState({connection: false});
        } else {
            this.setState({connection: true});
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
        if (this.popupMessage.message != ''){
            this.popupMessage = {...this.popupMessage, title: '', message: ''};
            this.forceUpdate();
        }
        if (this.time) {
            clearTimeout(this.time);
        }
    };

    time = '';

    sendPopup = (title, message) => {
        this.popupMessage = {title: title, message: message, previousMessage: message};
        this.forceUpdate();
        this.time = setTimeout(this.resetErrorPopup, 2000);
    };

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

    //Create account button
    displayCreateButton = () => {
        if (this.props.loading == true)
        {
            return <Button 
                        title="Crear cuenta"
                        raised
                        type="outline"
                        loading = {true}
                        onPress= {()=> {this.checkAndRegister()}}
                        titleStyle= {buttonStyle.reglogButtonText}
                        buttonStyle= {{...buttonStyle.reglogButton}}
                        containerStyle= {{marginTop:'5%', width: '60%', alignSelf:'center', width: '70%'}}
                        /> 
        } else {
            return <Button 
                        title="Crear cuenta"
                        raised
                    // loading = {true}
                        type="outline"
                        onPress= {()=> {this.checkAndRegister()}}
                        titleStyle= {buttonStyle.reglogButtonText}
                        buttonStyle= {{...buttonStyle.reglogButton}}
                        containerStyle= {{marginTop:'5%', width: '60%', alignSelf:'center', width: '70%'}}
                        /> 
        }
    }

    componentWillUnmount = () => {
        if (this.time) {
            clearTimeout(this.time);
        }
    }

    //Main render
    render() {
        return (
            <KeyboardAvoidingView style={styles.avoidContainer} behavior={Platform.OS === 'ios' ? 'padding':''} enabled onStartShouldSetResponder = {() => {
                this.resetErrorPopup(true);
            }}>
                <StyledTitle text='Registrate' style={styles.logregTitle} />
                <Input 
                    placeholder= 'Name' 
                    onChangeText={(text) => {this.setState({name: text})}}
                    value = {this.state.name}
                    inputContainerStyle={{...this.style.name, marginTop:20}}
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
                    inputContainerStyle={{...this.style.surname}}
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
                    inputContainerStyle={{...this.style.email}}
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
                    inputContainerStyle={{...this.style.password}}
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
                    inputContainerStyle={{...this.style.confirmpassword}}
                    leftIcon = {{ type: 'material', name: 'lock'}} 
                    />
                <View style= {{height: 20}}>
                    {this.displayErrorMessage('confirmpassword')}
                </View>

                <View>
                    {this.displayCreateButton()}
                </View>
                
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
        token: state.token,
    }
}


function mapDispatchToProps(dispatch) {
    return {
        setLoading: (isLoading) => {
            dispatch({
                type: LOADING,
                loading: isLoading,
            })
        },
        setToken: (token) => {
            dispatch({
                type: GET_TOKEN,
                token: token,
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
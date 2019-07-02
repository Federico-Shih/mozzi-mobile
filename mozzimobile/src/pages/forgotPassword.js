//modules
import {View, Text, Dimensions, KeyboardAvoidingView, Platform} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Input, Button} from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';

//codes
import {validateEmail, errorMessages} from '../libraries/helpers';
import {recoverPassword} from '../libraries/connect/auth';
import styles from '../libraries/styles/styles';
import buttonStyle from '../libraries/styles/buttonsStyles';
import {StyledTitle, Popup} from '../libraries/props';
import {LOADING, GET_TOKEN} from '../actions';

type Props = {};

class ForgotPassword extends Component<Props> {
    constructor(props){
        super(props);
    }

    state = {
        email: '',
        password: '',
        connection: null,
    }; 
    
    error = {
        email: '',
        password: '',
    }
    
    style = {
        email: styles.inputText,
        password: styles.inputText,
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

    //Create account function
    checkAndRegister = async () => {
        let checkEmail = await this.checkIfValidEmailAndSet();

        if (checkEmail){
            
            await this.checkConnectivity();

            if(!this.state.connection) {
                this.sendPopup('Intenet connection failure', errorMessages.noConnection);
                return;
            }

            this.props.setLoading(true);
            //let response = await recoverPassword(this.state.email); 
            this.props.setLoading(false);

            /*
            switch (response.data.code) {
                case 'wrongPassword':
                    this.sendPopup('Wrong Password', errorMessages.wrongPassword);
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
                this.props.setToken(response.data.token);//storeData('@jwt', response.data.token);
                this.props.navigation.navigate('Home');
            }

            if (response.data.code == 'hasSession') {
                this.props.navigation.navigate('Home');
            }
            */
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
                        title="Recuperar Contraseña"
                        raised
                        type="outline"
                        loading = {true}
                        onPress= {()=> {this.checkAndRegister()}}
                        titleStyle= {buttonStyle.reglogButtonText}
                        buttonStyle= {{...buttonStyle.reglogButton}}
                        containerStyle= {{marginTop:'20%', width: '60%', alignSelf:'center', width: '70%'}}
                        /> 
        } else {
            return <Button 
                        title="Recuperar Contraseña"
                        raised
                    // loading = {true}
                        type="outline"
                        onPress= {()=> {this.checkAndRegister()}}
                        titleStyle= {buttonStyle.reglogButtonText}
                        buttonStyle= {{...buttonStyle.reglogButton}}
                        containerStyle= {{marginTop:'20%', width: '60%', alignSelf:'center', width: '70%'}}
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
                <StyledTitle text='Recuperar Contraseña' style={styles.logregTitle} />

                <Input 
                    keyboardType='email-address' 
                    placeholder= 'Email'
                    onChangeText={(text) => {this.setState({email: text.trim()})}}
                    onSubmitEditing= {()=> {this.checkIfValidEmailAndSet()}}
                    inputContainerStyle={{...this.style.email, marginTop: 60}}
                    leftIcon = {{ type: 'material', name: 'email'}} 
                    />
                <View style= {{height: 20}}>
                    {this.displayErrorMessage('email')}
                </View>
               
                <View style = {{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', marginTop: -10, marginRight: '7%'}}>
                    <Button
                        title= "Inicia Sesión"
                        type="clear"
                        titleStyle={styles.forgotPassword}
                        containerStyle={{}}
                        onPress={() => {this.props.navigation.navigate('Login')}}
                        />
                </View>
                
                <View style = {{flexDirection: 'row', marginTop: -10, alignSelf: 'flex-end', marginRight: '7%'}}>
                    <Text style={{...styles.smallLogInText, alignSelf:'center'}}>
                        ¿No tienes cuenta?
                    </Text>
                    <Button
                        title= "Registrate."
                        type="clear"
                        titleStyle={styles.smallLogInText}
                        containerStyle={{}}
                        onPress={() => {this.props.navigation.navigate('Register')}}
                        />
                </View>
                <View>
                    {this.displayCreateButton()}
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
        //token: state.token,
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
        /*
        setToken: (token) => {
            dispatch({
                type: GET_TOKEN,
                token: token,
            })
        }*/
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
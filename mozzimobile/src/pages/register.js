import {Text, View, TextInput, Dimensions} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import {Title, Button, InputWithIcon, StyledTitle} from '../libraries/props';
import { LOGGING_IN } from '../actions';
import {connect} from 'react-redux';


type Props = {};
const date = (new Date()).toISOString().split('T')[0];

const InputTextWidth = (Math.round((1 - 60/Dimensions.get('window').width)*100)).toString() + '%';

class Register extends Component<Props> {
    constructor(props){
        super(props);
    }

    state = {
        name: '',
        surname: '',
        date: date,
        email: '',
        password: ''
    };
    


    render() {
        return (
                <View style={styles.container}>
                    <StyledTitle text='Registrate' style={styles.logregTitle} />
    
                    <View style = {{width: InputTextWidth, alignContent:'center', alignItems: 'center', flex: 10, marginTop: '5%'}}>
                        <InputWithIcon 
                            style= {styles.inputText} 
                            placeholder= 'Name' 
                            onChangeText={(text) => {this.setState({name: text})}}
                            value = {this.state.name}
                            />
                        <InputWithIcon 
                            style= {styles.inputText} 
                            placeholder= 'Surname' 
                            onChangeText={(text) => {this.setState({surname: text})}}
                            value = {this.state.surname}
                            />
                        <InputWithIcon 
                            keyboardType='email-address' 
                            style= {styles.inputText} 
                            placeholder= 'e-mail address' 
                            />
                        <InputWithIcon 
                            secureTextEntry= {true} 
                            style= {styles.inputText} 
                            placeholder= 'password' 
                            />
                    </View>
                    <View style = {{alignSelf: 'stretch', marginBottom: '0%', justifyContent: 'flex-end', flex: 1}}>         
                        <Button styles={styles.backButton} text="Back" onPress = {()=> { this.props.navigation.goBack()}} />
                    </View>
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
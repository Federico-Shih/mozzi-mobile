import {Text, View, Dimensions} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import {Title} from '../libraries/props';
import { Button } from 'react-native-elements';
import {connect} from 'react-redux';

type Props = {};

const ButtonWidth = (Math.round((200*411/Dimensions.get('window').width)));

class MainPage extends Component<Props> {

    changePage(newPage) {
        this.props.navigation.navigate(newPage);
    }

    render() {
        return (
            <View style={styles.container}>
                <Title text="Mozzi Project"/>
  
                <View style={{alignItems:'center', top:50, width: '80%', height: '50%'}}>
                    <Button hitSlop={{top:10, bottom:10, left:40, right:40}} 
                        onPress={()=>this.changePage('Login')} 
                        title='Login'
                        titleStyle= {{fontSize: 30}}
                        type='outline'
                        buttonStyle = {{borderWidth: 3, width: ButtonWidth}}
                        />

                    <Button hitSlop={{top:10, bottom:10, left:40, right:40}} 
                        onPress={()=>this.changePage('Register')} 
                        title="Register" 
                        titleStyle= {{fontSize: 30}}
                        type='outline'
                        containerStyle= {{top: '5%'}}
                        buttonStyle = {{borderWidth: 3, width: ButtonWidth}}
                        />
                </View>
            </View>
    );
    }
}

function mapStateToProps(state) {
    return {
        currentPage: state.currentPage,
    }
}


function mapDispatchToProps(dispatch) {
    return {
        changePage: (newPage) => {
            dispatch(changePage(newPage));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage)


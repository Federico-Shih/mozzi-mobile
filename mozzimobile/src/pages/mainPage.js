import {Text, View} from 'react-native';
import React, {Component} from 'react';
import styles from '../styles/styles';
import {Title, Button} from '../props';
import {connect} from 'react-redux';

type Props = {};

class MainPage extends Component<Props> {

    changePage(newPage) {
        this.props.navigation.navigate(newPage);
        //this.props.changePage(newPage);
    }

    render() {
      return (
        <View style={styles.container}>
          <Title text="Mozzi Project"/>
  
          <Text style={styles.textTest}>
              {this.props.currentPage}
          </Text>
  
          <View style={{flexDirection: 'column', justifyContent:'space-around', top:80}}>
            <Button hitSlop={{top:10, bottom:10, left:40, right:40}} onPress={()=>this.changePage('Login')} text="Login" fontSize={30}/>
            <Button hitSlop={{top:10, bottom:10, left:40, right:40}} onPress={()=>this.changePage('Register')} text="Register" fontSize={30}/>
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


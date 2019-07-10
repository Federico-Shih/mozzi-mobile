import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import { Input, Button, Header, Icon} from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import SideMenu from 'react-native-side-menu-over';
 
type Props = {};

export default class Register extends Component<Props> {
    state = {
        isOpen: false,    
    };

    toggle () {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
    
    updateMenuState(isOpen) {
        this.setState({
          isOpen: isOpen,
        })
    }

    render() {
          return (
            <SideMenu 
                menu={<Menu navigation={this.props.navigation}/>} 
                isOpen={this.state.isOpen}
                onChange= {isOpen => this.updateMenuState(isOpen)}
            >
                <View style={styles.container}>
                    <Header
                        leftComponent=
                        {
                          <Button 
                              containerStyle = {{bottom: '50%'}}
                              icon = {
                                    <Icon
                                        name="menu"
                                        size={30}
                                    />
                                  }
                              type = 'clear'
                              onPress = {() => {this.toggle()}}
                              />
                        }
                        containerStyle= {{height: '7%', backgroundColor: '#F5FCFF', borderWidth: 0}}
                        centerComponent= {{text: 'Mozzi', style: {bottom: '50%', fontSize: 25}}}
                        placement= 'left'
                    />
                    <ScrollView style= {{width: '100%'}}>
                      {
                          
                      }
                    </ScrollView>
                </View>  
            </SideMenu>
          
          );
    }
}


function Menu ({navigation}) {
    return(
        <ScrollView scrollsToTop = {false} style = {menuStyles.menu} contentContainerStyle = {{justifyContent: 'flex-end'}}>
            <View style={menuStyles.avatarContainer}>
                <Image
                  style={menuStyles.avatar}
                  source={{ uri: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png' }}
                />
                <Text style={menuStyles.name}>Your name</Text>
            </View>

            <Button
                title = 'Tus Turnos'
                type = 'clear'
                containerStyle = {menuStyles.itemContainer}
                titleStyle = {menuStyles.item}
                onPress={() => navigation.navigate('Turns')}
            >

            </Button>

            <Text
              onPress={() => navigation.navigate('Profile')}
              style={menuStyles.item}
            >
              Mi Perfil
            </Text>

            <Text
              onPress={() => navigation.navigate('Recent')}
              style={menuStyles.item}
            >
              Recientes
            </Text>
            

            <Text
              onPress={() => navigation.navigate('Favs')}
              style={menuStyles.item}
            >
              Favoritos
            </Text>

            <Text
              onPress={() => navigation.navigate('Config')}
              style={{...menuStyles.item, justifyContent: 'flex-end'}}
            >
              Configurar
            </Text>
            
        </ScrollView>
    );
}

const menuStyles = StyleSheet.create({
    menu: {
      flex: 1,
      width: '100%',
      backgroundColor: 'white',
      padding: 20,
    },
    avatarContainer: {
      marginBottom: 20,
      marginTop: 20,
      flexDirection: 'row',
      alignItems:'center'
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    name: {
      left: 20
    },
    item: {
      fontSize: 17,
      fontWeight: 'normal',
      color: 'grey',
      textAlign: 'left',
    },

    itemContainer: {
      width: '100%',
      justifyContent: 'flex-start',
    }
});
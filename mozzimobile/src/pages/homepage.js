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

const buttons = [
    {
      title: 'Tus Turnos',
      nav: 'Turns',
      id: 'turns',
      icon: 'event',
    },
    {
      title: 'Mi Perfil',
      nav: 'Profile',
      id: 'profile',
      icon: 'person',
    },
    {
      title: 'Recientes',
      nav: 'Recent',
      id: 'recent',
      icon: 'event',
    },
    {
      title: 'Favoritos',
      nav: 'Favs',
      id: 'favs',
      icon: 'restore',
    },
    {
      title: 'Configuración',
      nav: 'Config',
      id: 'config',
      icon: 'settings',
    }

]

function SideMenuButtons (props) {
    const listButtons = props.buttons.map((btn) => {
        return <Button
              title = {btn.title}
              key = {btn.id}
              type = 'clear'
              containerStyle = {menuStyles.itemContainer}
              titleStyle = {menuStyles.item}
              onPress={() => props.navigation.navigate(btn.nav)}
              buttonStyle = {menuStyles.itemButton}
              icon = {
                <Icon
                    name= {btn.icon}
                    size={25}
                />
              }
            />    
  });
    return (listButtons);
}

const User = {
    image: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
    name: 'Federico Shih',
}

function Menu ({navigation}) {
    return(
        <ScrollView scrollsToTop = {false} style = {menuStyles.menu} contentContainerStyle = {{height: '100%', justifyContent: 'flex-end'}}>
            <View style={menuStyles.avatarContainer}>
                <Image
                  style={menuStyles.avatar}
                  source={{ uri: User.image}}
                />
                <Text style={menuStyles.name}>{User.name}</Text>
            </View>

            <SideMenuButtons buttons= {buttons} navigation = {navigation}/>
            <View style = {{flex: 1}}></View>
            <Button 
                containerStyle = {{alignItems: 'flex-start', width: '100%'}}
                icon = {
                      <Icon
                          name="exit-to-app"
                          size={25}
                      />
                    }
                buttonStyle = {{width: '100%', paddingRight: '50%'}}
                type = 'clear'
                onPress = {() => {}}
                title = 'Cerrar Sesión'
                />
            
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
      fontSize: 15,
      fontWeight: 'normal',
      fontFamily: "monospace",
      paddingTop: 0,
      margin: 0,
      color: 'grey',
      textAlign: 'left',
      paddingLeft: 10,
    },
    itemContainer: {
      width: '100%',
      justifyContent: 'flex-start',
      margin: 0,
      padding: 0,
      paddingTop: 0,
    },
    itemButton: {
      justifyContent: 'flex-start',
      margin: 0,
      paddingVertical: 10,
    }
});
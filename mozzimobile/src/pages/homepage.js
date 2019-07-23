import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Text,
  KeyboardAvoidingView
} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import { SearchBar, Button, Header, Icon} from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import SideMenu from 'react-native-side-menu-over';
import {connect} from 'react-redux';
 
import {LOADING, REMOVE_TOKEN} from '../actions';

const devMode = true;
type Props = {};

class Homepage extends Component<Props> {
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

    componentDidMount() {
        if (this.props.token == '' && !devMode) {
            this.props.navigation.replace('Login');
        }
    }

    render() {
          return (
            <SideMenu 
                menu={<Menu navigation={this.props.navigation} removeToken = {this.props}/>} 
                isOpen={this.state.isOpen}
                onChange= {isOpen => this.updateMenuState(isOpen)}
            >
                <KeyboardAvoidingView style={styles.avoidContainer}>
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

                    <Button
                        icon={
                          <Icon
                            name="search"
                            size={22}
                            color="white"
                          />
                        }
                        iconContainerStyle = {{}}
                        title= '¿A dónde querés comprar?'
                        titleStyle = {{fontSize: 13, left: 10}}
                        containerStyle = {{borderRadius: 50, justifyContent: 'flex-start', width: '90%'}}
                        buttonStyle = {{borderRadius: 50, justifyContent: 'flex-start', paddingVertical: 8}}
                    />
                    <ScrollView style= {{width: '100%'}}>
                      {
                          
                      }
                    </ScrollView>
                    <View style = {{flex: 1}}/>
                </KeyboardAvoidingView>  
            </SideMenu> 
          
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
      removeToken: () => {
          dispatch({
              type: REMOVE_TOKEN,
          });
      },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)

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
      icon: 'restore',
    },
    {
      title: 'Favoritos',
      nav: 'Favs',
      id: 'favs',
      icon: 'star',
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

function Menu ({navigation, props}) {
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
                onPress = {() => {
                    props.removeToken();
                    navigation.replace('Login');
                }}
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
      padding: 0,
      paddingLeft: 0,
    },
    avatarContainer: {
      marginBottom: 20,
      marginTop: 20,
      flexDirection: 'column',
      alignItems:'center'
    },
    avatar: {
      width: 140,
      height: 140,
      borderRadius: 100,
    },
    name: {
      left: 0,
      paddingTop: 20,
      fontSize: 25, 
      color: 'black',
    },
    item: {
      fontSize: 18,
      fontWeight: 'normal',
      fontFamily: "monospace",
      paddingTop: 0,
      margin: 0,
      color: 'black',
      textAlign: 'left',
      paddingLeft: 30,
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
      paddingLeft: 15,
    }
});
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  Animated,
  Platform,
  Keyboard,
} from 'react-native';
import React, {Component} from 'react';
import styles from '../libraries/styles/styles';
import { SearchBar, Button, Header, Icon, Card, ListItem} from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import SideMenu from 'react-native-side-menu-over';
import {connect} from 'react-redux';
 
import {platformBackColor} from '../libraries/styles/constants';
import {LOADING, REMOVE_TOKEN} from '../actions';

const devMode = true;
type Props = {};

//Main homepage class
class Homepage extends Component<Props> {
    state = {
        isOpen: false,    
        searchBarIsOpen: false,
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

    toggleSearchBar () {
      this.setState({
        searchBarIsOpen: !this.state.searchBarIsOpen,
      });
    }

    render() {
          return (
            <SideMenu 
                menu={<Menu navigation={this.props.navigation} props = {this.props}/>} 
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
                        containerStyle= {{height: 60, backgroundColor: '#F5FCFF', borderWidth: 0}}
                        centerComponent= {{text: 'Mozzi', style: {bottom: '50%', fontSize: 25}}}
                        placement= 'left'
                    />

                    <ScrollView style= {{width: '100%'}}
                      scrollEnabled = {true}
                      >
                      <Button
                        icon={
                          <Icon
                            name="search"
                            size={22}
                            color="gray"
                          />
                        }
                        iconContainerStyle = {{}}
                        title= '¿A dónde querés comprar?'
                        onPress = {() => {
                          this.toggleSearchBar();
                        }}
                        titleStyle = {{fontSize: 13, left: 10, color: 'grey'}}
                        containerStyle = {{justifyContent: 'flex-start', width: '100%', alignItems: 'center'}}
                        buttonStyle = {{borderRadius: 50, justifyContent: 'flex-start', paddingVertical: 10, backgroundColor: '#E0E0E0', width: '90%'}}
                      />  
                      <MainSection /> 
                    
                    </ScrollView>                    
                </KeyboardAvoidingView>  
                <SearchBarSlideUp open = {this.state.searchBarIsOpen} toggle = {() => {this.toggleSearchBar()}}/>
            </SideMenu> 
          
          );
    }
}

const slideUpDuration = 300;

class SearchBarSlideUp extends Component<Props> {
    state = {
        anim: (this.props.open) ? new Animated.Value(-20) : new Animated.Value(20), 
        search: '',
        loading: false,
    }

    componentDidMount() {
        if (this.props.open) {
            Animated.timing(
                this.state.anim, 
                {
                    toValue: 0,
                    duration: slideUpDuration,
                }
            ).start();
        } else {
          this.setState({anim: new Animated.Value(Dimensions.get('window').height)});
        }
    }
    
    componentDidUpdate(prevProps) {
      if(this.props.open !== prevProps.open){
        if (this.props.open) {
            Animated.timing(
                this.state.anim, 
                {
                    toValue: 0,
                    duration: slideUpDuration,
                }
            ).start();
            this.textInput.focus();
        } else {
            Animated.timing(
                this.state.anim,
                {
                    toValue: Dimensions.get('window').height,
                    duration: slideUpDuration,
                }
            ).start();
        }
    }
    }

    updateSearch = search => {
      this.setState({ search });
    }

    render() {
      let { anim, search } = this.state;
      return (
        <Animated.View 
          style = {{...styles.container, 
                    backgroundColor: platformBackColor,
                    flex: 1, 
                    width: Dimensions.get('window').width, 
                    height: Dimensions.get('window').height, 
                    position: 'absolute',
                    top: anim,
                    }}>
            
            <Button
                icon={
                  <Icon
                    name={Platform.select({ios: 'arrow-back-ios', android: 'arrow-back'})}
                    size={30}
                    color="gray"
                  />
                }
                onPress = {() => {
                  Keyboard.dismiss();
                  this.props.toggle();
                }}
                containerStyle = {{borderRadius: 50, flexDirection: 'row' ,justifyContent: 'flex-start', alignItems: 'center', width: '100%', height: 50}}
                buttonStyle = {{borderRadius: 50, backgroundColor: platformBackColor, marginLeft: 5, marginTop: 5}}
                    />
            <SearchBar 
              ref = {ref => this.textInput = ref}
              placeholder= "Buscar..."
              onChangeText={this.updateSearch}
              value={search}
              //platform = {Platform.select({ios: 'ios', android: 'android'})}
              lightTheme
              showLoading = {this.state.loading}
              onSubmitEditing = {() => {
                this.setState({loading: true});
                
                this.setState({loading: false});
              }}
              round
              containerStyle = {{width: '90%', height: 60, backgroundColor: platformBackColor, borderWidth: 0, borderBottomWidth: 0, borderTopWidth: 0}}
            />
        </Animated.View>
      );
    }
}

//STRUCTURE OF THE MAIN SECTION OF THE MAINPAGE. THINGS LIKE RECENT STORES, CHANGE structure ONLOAD TO LOAD THE API DATA
const structure = [
  {
    title: 'Recientes',
    items: [
      {
        title: 'tienda 1',
        desc: 'no se'
      },
      {
        title: 'tienda 1',
        desc: 'no se'
      },
      {
        title: 'tienda 1',
        desc: 'no se'
      },
    ],
  },
  
  {
    title: 'Favoritos',
    items: [

    ],
  } ,
  {
    title: 'Recientes',
    items: [
      {
        title: 'tienda 1',
        desc: 'no se'
      },
      {
        title: 'tienda 1',
        desc: 'no se'
      },
      {
        title: 'tienda 1',
        desc: 'no se'
      },
    ],
  }, 
  {
    title: 'Recientes',
    items: [
      {
        title: 'tienda 1',
        desc: 'no se'
      },
      {
        title: 'tienda 1',
        desc: 'no se'
      },
      {
        title: 'tienda 1',
        desc: 'no se'
      },
    ],
  },
]

//TO CHANGE ELEMENTS THAT WILL BE DISPLAYED ON THE MAINSECTION OF THE MAINPAGE
function MainSection (props) {
    const listCards = structure.map((el, i) => {
        return <Card title = {el.title} key = {i}>
            {
                el.items.map((stores, k) => {
                    return <ListItem
                      key = {k}
                      title={stores.title}
                      />
                })
            }
        </Card>
    });
    return (listCards);
}

/*
====================
SIDEBAR MENU SECTION
====================
*/

//PROFILE DISPLAYED ON SIDEBAR MENU
const User = {
    image: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
    name: 'Federico Shih',
}

//MENU DISPLAYED ON SIDEBAR MENU
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


//Pretty self explanatory
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

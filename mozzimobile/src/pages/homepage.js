import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Text,
  KeyboardAvoidingView,
  Animated,
  Platform,
  Keyboard,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import React, { Component } from 'react';
import {
  SearchBar, Button, Header, Icon, Card, ListItem, Divider,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import SideMenu from 'react-native-side-menu-over';
import { connect } from 'react-redux';

import { platformBackColor } from '../libraries/styles/constants';
import { LOADING, REMOVE_TOKEN, ADD_BUSINESS_UUID } from '../actions';
import styles from '../libraries/styles/styles';
import { getStores } from '../libraries/connect/businessCalls';
import { getProfile } from '../libraries/connect/auth';

const devMode = true;
type Props = {};

// Main homepage class
class Homepage extends Component<Props> {
    state = {
      isOpen: false,
      searchBarIsOpen: false,
      profile: {
        name: '',
        image: null,
      }
    };

    static propTypes = {
      navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
      }).isRequired,
      token: PropTypes.string.isRequired,
      navigateToBusiness: PropTypes.func.isRequired,
    }

    componentDidMount() {
      const { navigation, token } = this.props;

      if (token === '' && !devMode) {
        navigation.replace('Login');
      } else {
        /*
        GET PROFILE LOGIC
        */
        const user = getProfile(token);
        this.setState({ profile: user });
      }
    }

    toggle() {
      const { isOpen } = this.state;
      this.setState({
        isOpen: !isOpen,
      });
    }

    updateMenuState(isOpen) {
      this.setState({
        isOpen,
      });
    }

    toggleSearchBar() {
      const { searchBarIsOpen } = this.state;
      this.setState({
        searchBarIsOpen: !searchBarIsOpen,
      });
    }

    render() {
      const { navigation, token, navigateToBusiness } = this.props;
      const { isOpen, searchBarIsOpen } = this.state;
      return (
        <SideMenu
          menu={<Menu navigation={navigation} props={this.props} state={this.state} />}
          isOpen={isOpen}
          onChange={open => this.updateMenuState(open)}
        >
          <KeyboardAvoidingView style={styles.avoidContainer}>
            <Header
              leftComponent={(
                <Button
                  containerStyle={{ bottom: '50%' }}
                  icon={
                    (
                      <Icon
                        name="menu"
                        size={30}
                      />
                    )
                      }
                  type="clear"
                  onPress={() => { this.toggle(); }}
                />
                )}
              containerStyle={{ height: 60, backgroundColor: '#F5FCFF', borderWidth: 0 }}
              centerComponent={{ text: 'Mozzi', style: { bottom: '50%', fontSize: 25 } }}
              placement="left"
            />

            <ScrollView
              style={{ width: '100%' }}
              scrollEnabled
            >
              <Button
                icon={(
                  <Icon
                    name="search"
                    size={22}
                    color="gray"
                  />
                )}
                iconContainerStyle={{}}
                title="¿A dónde querés comprar?"
                onPress={() => {
                  this.toggleSearchBar();
                }}
                titleStyle={{ fontSize: 13, left: 10, color: 'grey' }}
                containerStyle={{ justifyContent: 'flex-start', width: '100%', alignItems: 'center' }}
                buttonStyle={{
                  borderRadius: 50, justifyContent: 'flex-start', paddingVertical: 10, backgroundColor: '#E0E0E0', width: '90%',
                }}
              />
              <MainSection />

            </ScrollView>
          </KeyboardAvoidingView>
          <SearchBarSlideUp
            open={searchBarIsOpen}
            navigation={navigation}
            token={token}
            toggle={() => { this.toggleSearchBar(); }}
            navigateToBusiness={navigateToBusiness}
          />
        </SideMenu>

      );
    }
}

const slideUpDuration = 300;

class SearchBarSlideUp extends Component<Props> {
    state = {
      anim: new Animated.Value(20),
      search: '',
      loading: false,
      searchResults: [],
    }

    static propTypes = {
      open: PropTypes.bool.isRequired,
      toggle: PropTypes.func.isRequired,
      token: PropTypes.string.isRequired,
      navigateToBusiness: PropTypes.func.isRequired,
      navigation: PropTypes.object.isRequired,
    }

    componentDidMount() {
      const { open } = this.props;
      const { anim } = this.state;
      if (open) {
        Animated.timing(
          anim,
          {
            toValue: 0,
            duration: slideUpDuration,
          },
        ).start();
      } else {
        this.setState({ anim: new Animated.Value(Dimensions.get('window').height) });
      }
    }

    componentDidUpdate(prevProps) {
      const { open } = this.props;
      const { anim } = this.state;
      if (open !== prevProps.open) {
        if (open) {
          Animated.timing(
            anim,
            {
              toValue: 0,
              duration: slideUpDuration,
            },
          ).start();
          this.textInput.focus();
        } else {
          Animated.timing(
            anim,
            {
              toValue: Dimensions.get('window').height,
              duration: slideUpDuration,
            },
          ).start();
        }
      }
    }

    updateSearch = (search) => {
      this.setState({ search });
    }

    resetSearch = () => {
      this.setState({ searchResults: [], search: '' });
    }

    sendToPage = (uuid) => {
      const { navigateToBusiness, navigation } = this.props;
      navigateToBusiness(uuid);
      navigation.navigate('Business');
    }

    render() {
      const {
        anim, search, loading, searchResults,
      } = this.state;
      const { toggle, token } = this.props;
      return (
        <Animated.View
          style={{
            ...styles.container,
            backgroundColor: platformBackColor,
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            position: 'absolute',
            top: anim,
          }}
        >

          <Button
            icon={(
              <Icon
                name={Platform.select({ ios: 'arrow-back-ios', android: 'arrow-back' })}
                size={30}
                color="gray"
              />
            )}
            onPress={() => {
              Keyboard.dismiss();
              toggle();
              this.resetSearch();
            }}
            containerStyle={{
              borderRadius: 50, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', height: 50,
            }}
            buttonStyle={{
              borderRadius: 50, backgroundColor: platformBackColor, marginLeft: 5, marginTop: 5,
            }}
          />
          <SearchBar
            ref={(ref) => { this.textInput = ref; }}
            placeholder="Buscar..."
            onChangeText={text => this.updateSearch(text)}
            value={search}
            lightTheme
            showLoading={loading}
            onSubmitEditing={() => {
              this.setState({ loading: true });

              // CHANGE WHEN API IS HERE
              this.setState({ searchResults: getStores(search, token) });
              this.setState({ loading: false });
            }}
            round
            containerStyle={{
              width: '90%', height: 60, backgroundColor: platformBackColor, borderWidth: 0, borderBottomWidth: 0, borderTopWidth: 0,
            }}
          />
          <Divider style={{ backgroundColor: '#DDDDDD', width: '100%', height: 2 }} />
          <ScrollView
            style={
              {
                width: '100%',
                marginTop: 10,
              }
            }
          >

            {
              searchResults.map((el, o) => (
                <View key={o}>
                  {
                    Platform.select({
                      ios: (
                        <TouchableOpacity
                          onPress={() => {
                            this.sendToPage(el.uuid);
                          }}
                        >
                          <SearchElement el={el} />
                        </TouchableOpacity>
                      ),
                      android: (
                        <TouchableNativeFeedback
                          background={TouchableNativeFeedback.Ripple('#DDD')}
                          onPress={() => {
                            this.sendToPage(el.uuid);
                          }}
                        >
                          <View>
                            <SearchElement el={el} />
                          </View>
                        </TouchableNativeFeedback>
                      ),
                    })
                  }
                  <Divider style={{
                    backgroundColor: '#DDDDDD',
                    width: 300,
                    height: 0.9,
                    alignSelf: 'flex-end',
                  }}
                  />
                </View>
              ))
            }
          </ScrollView>
        </Animated.View>
      );
    }
}

function SearchElement({ el }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingLeft: 30,
        paddingVertical: 20,
        alignItems: 'center',
      }}
    >
      <Image
        source={{ uri: el.image }}
        style={{ width: 60, height: 60, borderRadius: 10 }}
      />
      <View style={{ flexDirection: 'column', left: 20 }}>
        <Text style={{ fontSize: 20 }}>
          {el.name}
        </Text>
        <Text style={{ fontSize: 15 }}>
          {el.description}
        </Text>
      </View>
    </View>
  );
}

SearchElement.propTypes = {
  el: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

// STRUCTURE OF THE MAIN SECTION OF THE MAINPAGE. THINGS LIKE RECENT STORES, CHANGE structure ONLOAD TO LOAD THE API DATA
let structure = [
  {
    title: 'Recientes',
    items: [
      {
        title: 'tienda 1',
        desc: 'no se',
      },
      {
        title: 'tienda 1',
        desc: 'no se',
      },
      {
        title: 'tienda 1',
        desc: 'no se',
      },
    ],
  },

  {
    title: 'Favoritos',
    items: [

    ],
  },
  {
    title: 'Recientes',
    items: [
      {
        title: 'tienda 1',
        desc: 'no se',
      },
      {
        title: 'tienda 1',
        desc: 'no se',
      },
      {
        title: 'tienda 1',
        desc: 'no se',
      },
    ],
  },
  {
    title: 'Recientes',
    items: [
      {
        title: 'tienda 1',
        desc: 'no se',
      },
      {
        title: 'tienda 1',
        desc: 'no se',
      },
      {
        title: 'tienda 1',
        desc: 'no se',
      },
    ],
  },
];

// TO CHANGE ELEMENTS THAT WILL BE DISPLAYED ON THE MAINSECTION OF THE MAINPAGE
function MainSection(props) {
  const listCards = structure.map((el, i) => (
    <Card title={el.title} key={i}>
      {
        el.items.map((stores, k) => (
          <ListItem
            key={k}
            title={stores.title}
          />
        ))
      }
    </Card>
  ));
  return (listCards);
}

/*
====================
SIDEBAR MENU SECTION
====================
*/

// PROFILE DISPLAYED ON SIDEBAR MENU

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
  },

];

// Pretty self explanatory
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
    alignItems: 'center',
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
    fontFamily: 'monospace',
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
  },
});

// MENU DISPLAYED ON SIDEBAR MENU
function Menu({ navigation, props, state }) {
  return (
    <ScrollView scrollsToTop={false} style={menuStyles.menu} contentContainerStyle={{ height: '100%', justifyContent: 'flex-end' }}>
      <View style={menuStyles.avatarContainer}>
        <Image
          style={menuStyles.avatar}
          source={{ uri: state.profile.image }}
        />
        <Text style={menuStyles.name}>{state.profile.name}</Text>
      </View>

      <SideMenuButtons buttons={buttons} navigation={navigation} />
      <View style={{ flex: 1 }} />
      <Button
        containerStyle={{ alignItems: 'flex-start', width: '100%' }}
        icon={(
          <Icon
            name="exit-to-app"
            size={25}
          />
        )}
        buttonStyle={{ width: '100%', paddingRight: '50%' }}
        type="clear"
        onPress={() => {
          props.removeToken();
          navigation.replace('Login');
        }}
        title="Cerrar Sesión"
      />

    </ScrollView>
  );
}

Menu.propTypes = {
  props: PropTypes.shape({
    removeToken: PropTypes.func,
  }).isRequired,
  navigation: PropTypes.shape({
    replace: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
  state: PropTypes.shape({
    profile: PropTypes.object,
  }).isRequired,
};

function SideMenuButtons(props) {
  const listButtons = props.buttons.map(btn => (
    <Button
      title={btn.title}
      key={btn.id}
      type="clear"
      containerStyle={menuStyles.itemContainer}
      titleStyle={menuStyles.item}
      onPress={() => props.navigation.navigate(btn.nav)}
      buttonStyle={menuStyles.itemButton}
      icon={
        (
          <Icon
            name={btn.icon}
            size={25}
          />
        )
      }
    />
  ));
  return (listButtons);
}

function mapStateToProps(state) {
  return {
    loading: state.loading,
    token: state.token,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    setLoading: (isLoading) => {
      dispatch({
        type: LOADING,
        loading: isLoading,
      });
    },
    removeToken: () => {
      dispatch({
        type: REMOVE_TOKEN,
      });
    },
    navigateToBusiness: (uuid) => {
      dispatch({
        type: ADD_BUSINESS_UUID,
        uuid,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);

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
  BackHandler,
} from 'react-native';
import React, { Component } from 'react';
import {
  SearchBar,
  Button,
  Header,
  Icon,
  Card,
  ListItem,
  Divider,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import SideMenu from 'react-native-side-menu-over';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';

import { errorMessages, sendPopup, units } from '../libraries/helpers';
import { platformBackColor } from '../libraries/styles/constants';
import { LOADING, REMOVE_TOKEN, ADD_BUSINESS_UUID, ADD_USER, REMOVE_USER } from '../actions';
import styles from '../libraries/styles/styles';
import { getStores, getCollections } from '../libraries/connect/businessCalls';
import { getProfile } from '../libraries/connect/auth';

const devMode = true;
type Props = {};

const {
  vh, vw, vmax, vmin,
} = units;

const MyButton = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback,
});

// Main homepage class
class Homepage extends Component<Props> {
  state = {
    isOpen: false,
    searchBarIsOpen: false,
    profile: {
      name: '',
      image: null,
    },
    collections: [],
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    token: PropTypes.string.isRequired,
    navigateToBusiness: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.searchModal = React.createRef();
  }

  async componentDidMount() {
    const { navigation, token, addUser } = this.props;

    if (token === '' && !devMode) {
      navigation.replace('Login');
      sendPopup('El cliente no tiene una sesión valida');
    } else {
      const { data } = await getProfile({ token });
      if (data.errors) {
        data.errors.forEach((el) => {
          sendPopup(el.message);
        });
      } else {
        addUser(data.data.me);
        this.setState({
          profile: {
            ...data.data.me,
            image: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
          },
        });
      }
    }

    const collections = await getCollections({ token });
    this.setState({ collections });
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

  closeSearchBar() {
    this.setState({
      searchBarIsOpen: false,
    });
  }

  toggleSearchBar() {
    const { searchBarIsOpen } = this.state;
    const { current } = this.searchModal;
    this.setState({
      searchBarIsOpen: !searchBarIsOpen,
    });
  }

  render() {
    const { navigation, token, navigateToBusiness } = this.props;
    const { isOpen, searchBarIsOpen, collections } = this.state;
    return (
      <SideMenu
        menu={(
          <Menu
            navigation={navigation}
            props={this.props}
            state={this.state}
            searchModal={this.searchModal}
          />
)}
        isOpen={isOpen}
        onChange={open => this.updateMenuState(open)}
      >
        <NavigationEvents
          onWillFocus={(payload) => {
            const { current } = this.searchModal;
            current.resetSearch();
            if (payload.action.type === 'Navigation/POP') {
              this.setState({ searchBarIsOpen: false });
              current.resetSearch();
            } else if (payload.action.type === 'Navigation/BACK') {
              current.addGoBackEvent();
            }
          }}
        />
        <KeyboardAvoidingView style={styles.avoidContainer}>
          <Header
            leftComponent={(
              <Button
                containerStyle={{ bottom: '50%' }}
                icon={<Icon name="menu" size={30} />}
                type="clear"
                onPress={() => {
                  this.toggle();
                }}
              />
)}
            containerStyle={{
              height: 60,
              backgroundColor: platformBackColor,
              borderWidth: 0,
            }}
            placement="left"
          />

          <ScrollView style={{ width: '100%', top: 5 }} scrollEnabled>
            <View
              style={{
                justifyContent: 'center',
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Button
                icon={<Icon name="search" size={22} color="gray" />}
                // title="¿A dónde querés comprar?"
                onPress={() => {
                  this.toggleSearchBar();
                }}
                containerStyle={{ width: '80%' }}
                titleStyle={{ fontSize: 13, left: 10, color: 'grey' }}
                buttonStyle={{
                  borderRadius: 15,
                  justifyContent: 'flex-start',
                  paddingVertical: 10,
                  backgroundColor: '#E0E0E0',
                  width: '100%',
                }}
              />
              <Button
                onPress={() => {
                  alert('In progresss');
                }}
                icon={(
                  <Icon
                    name="settings-input-component"
                    size={30}
                    underlayColor="rgba(1,1,1, 0.2)"
                  />
                )}
                containerStyle={{ overflow: 'hidden', left: 5 }}
                buttonStyle={{ backgroundColor: 'transparent', borderRadius: 50 }}
              />
            </View>
            <View
              style={{
                height: vh * 23,
                width: 100 * vw,
                marginTop: 2 * vh,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {collections.map(el => (
                <View
                  key={el.uuid}
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      borderRadius: 50,
                      overflow: 'hidden',
                      height: 14 * vmin,
                      width: 14 * vmin,
                      backgroundColor: '#6A32E3',
                    }}
                  >
                    <MyButton
                      background={TouchableNativeFeedback.Ripple('#AAF', false)}
                    >
                      <View
                        style={{
                          height: '100%',
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon
                          name="accessibility"
                          size={10 * vmin}
                          color="white"
                        />
                      </View>
                    </MyButton>
                  </View>
                  <Text style={{ fontFamily: 'Nunito-SemiBold', fontSize: 14 }}>
                    {el.name}
                  </Text>
                </View>
              ))}
            </View>
            <MainSection />
          </ScrollView>
        </KeyboardAvoidingView>
        <SearchBarSlideUp
          open={searchBarIsOpen}
          navigation={navigation}
          token={token}
          ref={this.searchModal}
          toggle={() => {
            this.toggleSearchBar();
          }}
          close={() => {
            this.closeSearchBar();
          }}
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
  };

  static propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    navigateToBusiness: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { open } = this.props;
    const { anim } = this.state;
    if (open) {
      Animated.timing(anim, {
        toValue: 0,
        duration: slideUpDuration,
      }).start();
    } else {
      this.setState({
        anim: new Animated.Value(Dimensions.get('window').height),
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { open } = this.props;
    const { anim } = this.state;
    if (open !== prevProps.open) {
      if (open) {
        Animated.timing(anim, {
          toValue: 0,
          duration: slideUpDuration,
        }).start();
        this.textInput.focus();
      } else {
        Animated.timing(anim, {
          toValue: Dimensions.get('window').height,
          duration: slideUpDuration,
        }).start();
      }
    }
    this.addGoBackEvent();
  }

  componentWillUnmount() {
    if (this.backHandler) this.backHandler.remove();
  }

  goBack = () => {
    const { close, navigation, open } = this.props;
    if (open) {
      close();
      this.resetSearch();
      return true;
    }
    return false;
  };

  removeHandler = () => {
    if (this.backHandler) this.backHandler.remove();
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  resetSearch = () => {
    this.setState({ searchResults: [], search: '' });
  };

  sendToPage = (uuid) => {
    const { navigateToBusiness, navigation } = this.props;
    navigateToBusiness(uuid);
    navigation.navigate('Business');
    this.backHandler.remove();
  };

  addGoBackEvent() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.goBack,
    );
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
              name={Platform.select({
                ios: 'arrow-back-ios',
                android: 'arrow-back',
              })}
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
            borderRadius: 50,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            height: 50,
          }}
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: platformBackColor,
            marginLeft: 5,
            marginTop: 5,
          }}
        />
        <SearchBar
          ref={(ref) => {
            this.textInput = ref;
          }}
          placeholder="Buscar..."
          onChangeText={text => this.updateSearch(text)}
          value={search}
          lightTheme
          showLoading={loading}
          onSubmitEditing={async () => {
            this.setState({ loading: true });
            if (!(search.length <= 1 || search.length > 25)) {
              const storeResults = await getStores({ search, token });
              const { data } = storeResults;
              if (data.errors) {
                data.errors.forEach((el) => {
                  sendPopup(el.message);
                });
              } else if (data.data.businessSearch === null) {
                this.setState({ searchResults: [] });
              } else {
                this.setState({ searchResults: data.data.businessSearch });
              }
            } else if (search.length === 1) {
              sendPopup(errorMessages.notEnoughLength);
            } else if (search.length > 25) {
              sendPopup(errorMessages.tooMuchLength);
            }
            // CHANGE WHEN API IS HERE
            this.setState({ loading: false });
          }}
          round
          containerStyle={{
            width: '90%',
            height: 60,
            backgroundColor: platformBackColor,
            borderWidth: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          }}
        />
        <Divider
          style={{ backgroundColor: '#DDDDDD', width: '100%', height: 2 }}
        />
        <ScrollView
          style={{
            width: '100%',
            marginTop: 10,
          }}
        >
          {searchResults.map((el, o) => (
            <View key={o}>
              <MyButton
                background={TouchableNativeFeedback.Ripple('#DDD')}
                onPress={() => {
                  this.sendToPage(el.uuid);
                }}
              >
                <View>
                  <SearchElement el={el} />
                </View>
              </MyButton>
              <Divider
                style={{
                  backgroundColor: '#DDDDDD',
                  width: 300,
                  height: 0.9,
                  alignSelf: 'flex-end',
                }}
              />
            </View>
          ))}
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
        source={{ uri: 'https://semantic-ui.com/images/wireframe/image.png' }}
        style={{ width: 60, height: 60, borderRadius: 10 }}
      />
      <View style={{ flexDirection: 'column', paddingLeft: 20 }}>
        <Text style={{ fontSize: 20 }}>{el.name}</Text>
        <Text style={{ fontSize: 15, maxWidth: 290 }}>{el.description}</Text>
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
const structure = [
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
    items: [],
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
      {el.items.map((stores, k) => (
        <ListItem key={k} title={stores.title} />
      ))}
    </Card>
  ));
  return listCards;
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
    fontFamily: 'Nunito-SemiBold',
  },
  item: {
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'Nunito-SemiBold',
    paddingTop: 0,
    margin: 0,
    color: 'black',
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
    paddingLeft: 15,
  },
});

// MENU DISPLAYED ON SIDEBAR MENU
function Menu({
  navigation, props, state, searchModal,
}) {
  return (
    <ScrollView
      scrollsToTop={false}
      style={menuStyles.menu}
      contentContainerStyle={{ height: '100%', justifyContent: 'flex-end' }}
    >
      <View style={menuStyles.avatarContainer}>
        <Image
          style={menuStyles.avatar}
          source={{ uri: state.profile.image }}
        />
        <Text style={menuStyles.name}>
          {`${state.profile.name} ${state.profile.lastname}`}
        </Text>
      </View>

      <SideMenuButtons
        buttons={buttons}
        navigation={navigation}
        searchModal={searchModal}
      />
      <View style={{ flex: 1 }} />
      <Button
        containerStyle={{ width: '100%' }}
        icon={<Icon name="exit-to-app" color="#5819E0" size={25} />}
        titleStyle={{
          color: 'black',
          fontFamily: 'Nunito-SemiBold',
          left: 10,
          fontSize: 20,
        }}
        buttonStyle={{
          justifyContent: 'center',
          paddingRight: 20,
          paddingVertical: 10,
        }}
        type="clear"
        onPress={() => {
          props.removeToken();
          props.removeUser();
          navigation.replace('Auth');
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
      onPress={() => {
        props.navigation.navigate(btn.nav);
        props.searchModal.current.removeHandler();
      }}
      buttonStyle={menuStyles.itemButton}
      icon={<Icon name={btn.icon} color="#5819E0" size={25} />}
    />
  ));
  return listButtons;
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
    addUser: (user) => {
      dispatch({
        type: ADD_USER,
        user,
      });
    },
    removeUser: () => {
      dispatch({
        type: REMOVE_USER,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Homepage);

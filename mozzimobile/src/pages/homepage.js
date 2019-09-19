import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import React, { Component } from 'react';
import {
  Button,
  Header,
  Icon,
  Card,
  ListItem,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';

import {
  errorMessages,
  sendPopup,
  units,
  UserData,
} from '../libraries/helpers';
import { platformBackColor } from '../libraries/styles/constants';
import {
  LOADING,
  REMOVE_TOKEN,
  ADD_BUSINESS_UUID,
  ADD_USER,
  REMOVE_USER,
} from '../actions';
import styles from '../libraries/styles/styles';
import { getStores, getCollections } from '../libraries/connect/businessCalls';
import { getProfile } from '../libraries/connect/auth';
import SearchBarSlideUp from './searchbar';

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
        const { me } = data.data;
        addUser({
          ...me,
          image: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
        });
        if (!UserData.checkUser(me.uuid)) {
          UserData.createUser(me.uuid);
        }
      }
    }

    const collections = await getCollections({ token });
    this.setState({ collections });
  }

  toggle() {
    const { navigation } = this.props;
    navigation.openDrawer();
  }

  closeSearchBar() {
    const { current } = this.searchModal;
    current.close();
  }

  toggleSearchBar() {
    const { current } = this.searchModal;
    current.toggle();
  }

  render() {
    const { navigation, token, navigateToBusiness } = this.props;
    const { collections } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={(payload) => {
            const { current } = this.searchModal;
            current.resetSearch();
            if (payload.action.type === 'Navigation/POP') {
              current.close();
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
                buttonStyle={{
                  backgroundColor: 'transparent',
                  borderRadius: 50,
                }}
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
          navigation={navigation}
          token={token}
          ref={this.searchModal}
          navigateToBusiness={navigateToBusiness}
        />
      </View>
    );
  }
}

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

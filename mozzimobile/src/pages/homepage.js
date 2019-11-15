import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  FlatList,
} from 'react-native';
import React, { Component } from 'react';
import {
  Button,
  Header,
  Icon,
  Card,
  ListItem,
  Image,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';

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
import { SearchButton } from '../libraries/props';
import styles from '../libraries/styles/styles';
import { getStores, getCollections, getRandomBusinesses } from '../libraries/connect/business-calls';
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
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    token: PropTypes.string.isRequired,
    navigateToBusiness: PropTypes.func.isRequired,
  };

  state = {
    searchBarIsOpen: false,
    collections: [],
    recommended: [],
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
    const recommended = await getRandomBusinesses({ token, limit: 5 });
    this.setState({ collections, recommended });
  }

  toggle() {
    const { navigation } = this.props;
    navigation.openDrawer();
  }

  onPress = (uuid) => {
    const { navigateToBusiness, navigation } = this.props;
    navigateToBusiness(uuid);
    navigation.navigate('Business');
  };

  closeSearchBar() {
    const { current } = this.searchModal;
    const { navigation } = this.props;
    navigation.setParams({
      searchBarIsOpen: false,
    });
    this.setState({ searchBarIsOpen: false });
    current.close();
  }

  toggleSearchBar() {
    const { current } = this.searchModal;
    const { navigation } = this.props;
    const { searchBarIsOpen } = this.state;
    navigation.setParams({
      searchBarIsOpen: !searchBarIsOpen,
    });
    this.setState({ searchBarIsOpen: !searchBarIsOpen });
    current.toggle();
  }

  render() {
    const { navigation, token, navigateToBusiness } = this.props;
    const { collections, recommended } = this.state;
    return (
      <View style={{ flex: 1 }}>
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
              <SearchButton
                onPress={() => {
                  this.toggleSearchBar();
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
            <Text style={{
              fontFamily: 'Nunito-SemiBold', fontSize: 20, color: '#000000', left: 20, marginTop: 20,
            }}
            >
                  Sugerencias
            </Text>
            <View style={{ }}>
              {
                  recommended.map(({
                    name, uuid, category, description, street, number, zone, key,
                  }) => (
                    <MyButton onPress={() => this.onPress(uuid)} key={key}>
                      <View
                        style={{
                          height: 16 * vh,
                          width: 100 * vw,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Image
                          source={{ uri: 'https://semantic-ui.com/images/wireframe/image.png' }}
                          style={{ width: 14 * vh, height: 14 * vh }}
                        />
                        <View
                          style={{
                            marginVertical: 1 * vh,
                            marginLeft: 14,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: 'Nunito-SemiBold',
                              fontSize: 22,
                              color: 'black',
                            }}
                            numberOfLines={2}
                          >
                            {name}
                          </Text>
                          <Text style={{ height: 2 * vh, fontSize: 18, color: 'black' }}>
                            {category}
                          </Text>
                          <Text style={{ width: 60 * vw, fontSize: 13, color: '#5F5F5F' }}>
                            {description}
                          </Text>
                          <Text style={{ fontSize: 16, color: 'black', marginTop: 3 }}>
                            {`${street} ${number}, ${zone}`}
                          </Text>
                          <View style={{ flex: 1 }} />
                        </View>
                      </View>
                    </MyButton>
                  ))
                }
            </View>
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

/*
}
<View
  style={{
    height: vh * 23,
    width: 92 * vw,
    marginTop: 2 * vh,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  }}
>
  {collections.map(el => (
    <View
      key={el.uuid}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 23 * vw,
        height: 23 * vw,
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
*/


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

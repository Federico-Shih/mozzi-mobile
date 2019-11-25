import {
  Dimensions,
  View,
  Image,
  Text,
  Animated,
  Platform,
  Keyboard,
  TouchableOpacity,
  TouchableNativeFeedback,
  BackHandler,
} from 'react-native';
import React, { Component } from 'react';
import { NavigationEvents } from 'react-navigation';
import {
  SearchBar,
  Button,
  Icon,
  Divider,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import update from 'immutability-helper';

import styles from '../libraries/styles/styles';
import { getStores } from '../libraries/connect/business-calls';
import {
  sendPopup, errorMessages, randomImage, units,
} from '../libraries/helpers';
import { platformBackColor } from '../libraries/styles/constants';

const slideUpDuration = 300;

const { vh, vw } = units;

const MyButton = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback,
});

const NOT_YET_SEARCH = 0;
const FOUND = 1;
const NOT_FOUND = 2;

export default class SearchBarSlideUp extends Component<Props> {
  state = {
    anim: new Animated.Value(20),
    search: '',
    loading: false,
    searchResults: [],
    open: false,
    style: {
      underlineColor: '#C4C4C4',
    },
    searchStatus: NOT_YET_SEARCH,
  };

  static propTypes = {
    token: PropTypes.string.isRequired,
    navigateToBusiness: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { anim, open } = this.state;
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

  componentDidUpdate(_, prevState) {
    const { anim, open } = this.state;
    if (open !== prevState.open) {
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
    const { open } = this.state;
    const { navigation } = this.props;
    if (open) {
      this.close();
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

  searchResult = (searchStatus, searchResults) => {
    console.log(searchStatus)
    if (searchStatus === NOT_YET_SEARCH) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', height: 80 * vh }}>
          <Text style={{
            fontFamily: 'Nunito-SemiBold', fontSize: 20, color: 'black', alignSelf: 'center',
          }}
          >
        Empezá a buscar!
          </Text>
        </View>
      );
    }
    if (searchStatus === NOT_FOUND) {
      return (
        <View style={{
          flex: 1, justifyContent: 'center', height: 80 * vh,
        }}
        >
          <Text style={{
            fontFamily: 'Nunito-SemiBold', fontSize: 20, color: 'black', alignSelf: 'center',
          }}
          >
        No se ha encontrado negocios...
          </Text>
        </View>
      );
    }
    if (searchStatus === FOUND) {
      return (
        searchResults.map(el => (
          <View key={el.uuid}>
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
        ))
      );
    }
  }

  addGoBackEvent() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.goBack,
    );
  }

  toggle() {
    const { open } = this.state;
    this.setState({
      open: !open,
    });
  }

  close() {
    this.setState({
      open: false,
    });
  }

  open() {
    this.setState({
      open: true,
    });
  }

  render() {
    const {
      anim,
      search,
      loading,
      searchResults,
      style,
      searchStatus,
    } = this.state;
    const { token } = this.props;
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
        <NavigationEvents
          onWillFocus={(payload) => {
            if (payload.action.type === 'Navigation/POP') {
              this.close();
              this.resetSearch();
            } else if (payload.action.type === 'Navigation/BACK') {
              this.addGoBackEvent();
            }
          }}
        />
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
            this.toggle();
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
                this.setState({ searchStatus: NOT_FOUND, loading: false });
              } else if (data.data.businessSearch.length === 0) {
                this.setState({ searchResults: [], searchStatus: NOT_FOUND, loading: false });
              } else {
                this.setState({ searchResults: data.data.businessSearch, searchStatus: FOUND, loading: false });
              }
            } else if (search.length === 1) {
              sendPopup(errorMessages.notEnoughLength);
            } else if (search.length > 25) {
              sendPopup(errorMessages.tooMuchLength);
            }
          }}
          containerStyle={{
            width: '90%',
            backgroundColor: platformBackColor,
            borderWidth: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          }}
          inputContainerStyle={{
            backgroundColor: platformBackColor,
            borderBottomColor: style.underlineColor,
            borderBottomWidth: 2,
            borderRadius: 0,
          }}
          inputStyle={{
            height: 30,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
          }}
          onFocus={() => {
            this.setState({ style: update(style, { underlineColor: { $set: '#4D9DE6' } }) });
          }}
          onBlur={() => {
            this.setState({ style: update(style, { underlineColor: { $set: '#C4C4C4' } }) });
          }}
        />
        <ScrollView
          style={{
            width: '100%',
            marginTop: 10,
          }}
        >
          {
            this.searchResult(searchStatus, searchResults)
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
        source={randomImage(el.name)}
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

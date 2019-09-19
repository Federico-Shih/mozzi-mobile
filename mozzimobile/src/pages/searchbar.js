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
import {
  SearchBar,
  Button,
  Icon,
  Divider,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';

import styles from '../libraries/styles/styles';
import { getStores } from '../libraries/connect/businessCalls';
import { sendPopup, errorMessages } from '../libraries/helpers';
import { platformBackColor } from '../libraries/styles/constants';

const slideUpDuration = 300;

const MyButton = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback,
});


export default class SearchBarSlideUp extends Component<Props> {
  state = {
    anim: new Animated.Value(20),
    search: '',
    loading: false,
    searchResults: [],
    open: false,
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
      anim, search, loading, searchResults,
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

import {
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Image, Divider, Button, Icon,
} from 'react-native-elements';
import newUUID from 'uuid';

import styles from '../libraries/styles/styles';
import {
  sendPopup, UserData, units, alphabetize,
} from '../libraries/helpers';
import {
  LOADING,
  REMOVE_BUSINESS_UUID,
  SELECT_SERVICE,
  REMOVE_SERVICE,
} from '../actions';
import { getBusiness } from '../libraries/connect/businessCalls';

type Props = {};

const { vh, vw } = units;

const ServiceButton = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback,
});

// Services template which shows brief info of each service
function Services({ el }) {
  let formatted = 'Duracion: ';
  const { duration } = el;
  if (duration !== null) {
    if (Math.floor(duration / 60) !== 0) {
      const unidad = duration / 60 === 1 ? 'Hora' : 'Horas';
      formatted = formatted.concat(`${Math.floor(duration / 60)} ${unidad} `);
    }
    if (duration % 60 !== 0) {
      formatted = formatted.concat(`${duration % 60} Minutos`);
    }
  } else {
    formatted = '';
  }
  return (
    <View style={{ color: 'black' }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{
          flexDirection: 'column', justifyContent: 'flex-start', height: '100%',
        }}
        >
          <Text style={{ fontSize: 16, color: '#000000', fontFamily: 'Nunito-SemiBold' }}>{el.name}</Text>
          <Text style={{ fontFamily: 'Nunito-SemiBold' }}>{`${formatted}`}</Text>
          <View style={{ flex: 1 }} />
        </View>
        <View style={{ flex: 1 }} />
        <Text style={{
          marginRight: 30, alignSelf: 'center', fontSize: 20, color: 'black', fontFamily: 'Nunito-SemiBold',
        }}
        >
          {`$ ${el.price}`}
        </Text>
      </View>
    </View>
  );
}

Services.propTypes = {
  el: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    duration: PropTypes.number,
  }).isRequired,
};

// Main business page
class Business extends Component<Props> {
  state = {
    business: {
      name: '',
      street: '',
      number: null,
      description: '',
      zone: '',
      services: [],
      image: null,
    },
    favorite: false,
  };

  titleSize = 0;

  // Validates props
  static propTypes = {
    token: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
    navigateToSearcher: PropTypes.func.isRequired,
    addService: PropTypes.func.isRequired,
  };

  // Gets the business when it mounts
  componentDidMount = async () => {
    /*
    basic catch and then when get Business receives the API call
    */
    const { token, uuid, user } = this.props;
    const business = await getBusiness({ token, uuid });
    const { data } = business;
    if (data.errors) {
      data.errors.forEach((el) => {
        sendPopup(el.message);
      });
    } else {
      const { business: response } = data.data;
      this.titleSize = Math.min((80 * vw) / response.name.length, 30);
      this.setState({ business: response });
      if (UserData.checkUser(user.uuid)) {
        UserData.updateUserRecents({
          uuid: user.uuid,
          business: {
            name: response.name,
            description: response.description,
            uuid,
            street: response.street,
            number: response.number,
            zone: response.zone,
            category: response.category ? response.category : '',
          },
        });
      }
    }
  };

  toggleFavorite = (business) => {
    const { favorite } = this.state;
    const { user } = this.props;
    this.setState({ favorite: !favorite });
    if (favorite) {
      UserData.removeUserFavorites({ uuid: user.uuid, business });
    }
  };

  // Depending on the service id, navigates to the calendar and uses redux to save the service selected
  navToCalendar = (id) => {
    const { addService, navigation } = this.props;
    addService(id);
    navigation.navigate('Calendar');
  };

  // Main render process
  render() {
    const { business, favorite } = this.state;
    const { navigation, navigateToSearcher } = this.props;
    const {
      street, zone, number, postal,
    } = business;

    const alphabetizedList = alphabetize(business.services);
    return (
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Image
            source={{
              uri: 'https://semantic-ui.com/images/wireframe/image.png',
            }}
            style={{
              width: 100 * vw,
              height: 20 * vh,
              resizeMode: 'contain',
              opacity: 0.9,
            }}
          />
          <View
            style={{
              marginTop: 20,
              top: 20 * vw,
              width: '100%',
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: 'black',
                marginLeft: 10,
              }}
            >
              Servicios
            </Text>
            <Divider
              style={{
                height: 1.5,
                width: '90%',
                marginTop: 5,
                marginLeft: 10,
                backgroundColor: 'grey',
              }}
            />

            <ScrollView
              style={{
                width: '100%',
              }}
            >
              {business.services.map(el => (
                <ServiceButton
                  key={newUUID()}
                  background={Platform.select({
                    android: TouchableNativeFeedback.Ripple('#DDD'),
                  })}
                  conta
                  onPress={() => {
                    this.navToCalendar(el.uuid);
                  }}
                >
                  <View style={{}}>
                    <View style={{ paddingVertical: 20, marginLeft: 20 }}>
                      <Services el={el} />
                    </View>
                    <Divider
                      style={{
                        height: 1,
                        width: '90%',
                        backgroundColor: 'grey',
                        marginLeft: 10,
                      }}
                    />
                  </View>
                </ServiceButton>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* TITLE NAME AND DESCRIPTION */}
        <View
          style={{
            position: 'absolute',
            alignItems: 'flex-start',
            left: 5 * vw,
            paddingTop: 20 * vh - 20 * vw,
            flexDirection: 'row',
          }}
        >
          <Image
            source={{
              uri: 'https://semantic-ui.com/images/wireframe/image.png',
            }}
            style={{
              resizeMode: 'cover',
              opacity: 0.9,
              width: 35 * vw,
              height: 35 * vw,
            }}
            containerStyle={{
              backgroundColor: 'white',
              borderRadius: 20 * vw,
              overflow: 'hidden',
              borderWidth: 8,
              borderColor: 'white',
            }}
          />
          <View
            style={{
              height: 'auto',
              width: 'auto',
            }}
          >
            <Text
              style={{
                color: 'black',
                fontFamily: 'Nunito-SemiBold',
                top: 22 * vw,
                left: 2 * vw,
                width: vw * 53,
                height: 100,
                fontSize: this.titleSize,
              }}
            >
              {business.name}
            </Text>
          </View>
        </View>

        {/* INFO BUTTONS ON THE TOP RIGHT */}
        <View
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
          }}
        >
          <Button
            icon={(
              <Icon
                name="info-outline"
                type="material"
                size={28}
                color="white"
              />
)}
            onPress={() => {
              /* TEMPORARY, REPLACE WITH INFORMATION PAGE */
              alert(`${street} ${number}, ${zone}. Codigo Postal ${postal}.`);
            }}
            buttonStyle={{ backgroundColor: 'transparent' }}
          />
          <Button
            icon={(
              <Icon
                name={favorite ? 'favorite' : 'favorite-border'}
                type="material"
                size={35}
                color="black"
              />
)}
            containerStyle={{
              top: 7 * vh,
              right: 2 * vw,
              borderRadius: 60,
              overflow: 'hidden',
            }}
            onPress={() => {
              this.toggleFavorite({
                uuid: business.uuid,
                name: business.name,
                description: business.description,
              });
            }}
            buttonStyle={{ backgroundColor: 'transparent' }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            alignSelf: 'flex-start',
          }}
        >
          <Icon
            name={Platform.select({
              ios: 'arrow-back-ios',
              android: 'arrow-back',
            })}
            size={28}
            onPress={() => {
              navigateToSearcher();
              navigation.goBack();
            }}
            color="white"
            containerStyle={{
              borderRadius: 50,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginLeft: 5,
              marginTop: 5,
            }}
            iconStyle={{
              padding: 5,
            }}
            underlayColor="rgba(1,1,1, 0.2)"
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading,
    token: state.token,
    uuid: state.businessUuid,
    user: state.user,
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
    navigateToSearcher: () => {
      dispatch({
        type: REMOVE_BUSINESS_UUID,
      });
      dispatch({
        type: REMOVE_SERVICE,
      });
    },
    addService: (id) => {
      dispatch({
        type: SELECT_SERVICE,
        id,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Business);

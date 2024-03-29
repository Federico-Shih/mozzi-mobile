import {
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Image, Divider, Button, Icon,
} from 'react-native-elements';
import newUUID from 'uuid';

import { ScrollView } from 'react-native-gesture-handler';
import styles from '../libraries/styles/styles';
import { sendPopup, UserData } from '../libraries/helpers';
import {
  LOADING,
  REMOVE_BUSINESS_UUID,
  SELECT_SERVICE,
  REMOVE_SERVICE,
} from '../actions';
import { getBusiness } from '../libraries/connect/businessCalls';

type Props = {};

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
        <View>
          <Text style={{ fontSize: 16 }}>{el.name}</Text>
          <Text>{`${formatted}`}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <Text>{`$ ${el.price}`}</Text>
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
  };

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

  /*
lastname: "Shih"
name: "Federico"
uuid: "845a0a9e-7ac3-4f71-8a02-11a51f5275a7"

  */
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
      const { business } = data.data;
      this.setState({ business });
      if (UserData.checkUser(user.uuid)) {
        UserData.updateUserRecents({
          uuid: user.uuid,
          business: {
            name: business.name,
            description: business.description,
            uuid,
          },
        });
        console.log(UserData.getRecents(user.uuid)[0]);
      }
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
    const { business } = this.state;
    const { navigation, navigateToSearcher } = this.props;
    const {
      street, zone, number, postal,
    } = business;
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
              width: 1000,
              height: 160,
              borderWidth: 30,
              resizeMode: 'contain',
              opacity: 0.9,
            }}
            containerStyle={{ backgroundColor: 'black' }}
          />
          <View
            style={{
              marginTop: 30,
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
                height: 1,
                width: '100%',
                marginTop: 5,
                marginLeft: 10,
              }}
            />

            <ScrollView
              style={{
                width: '100%',
              }}
            >
              {business.services.map(el => Platform.select({
                ios: (
                  <TouchableOpacity
                    key={newUUID()}
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
                          width: '100%',
                          backgroundColor: 'grey',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
                android: (
                  <TouchableNativeFeedback
                    key={newUUID()}
                    background={TouchableNativeFeedback.Ripple('#DDD')}
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
                          width: '100%',
                          backgroundColor: 'grey',
                          marginLeft: 10,
                        }}
                      />
                    </View>
                  </TouchableNativeFeedback>
                ),
              }))}
            </ScrollView>
          </View>
        </View>

        {/* TITLE NAME AND DESCRIPTION */}
        <View
          style={{
            position: 'absolute',
            alignItems: 'flex-start',
            left: 20,
            paddingTop: 65,
          }}
        >
          <View
            style={{
              height: 'auto',
              width: 'auto',
            }}
          >
            <Text style={{ fontSize: 30, color: 'white' }}>
              {business.name}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 15,
              paddingTop: 5,
              color: 'white',
            }}
          >
            {business.description}
          </Text>
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
            containerStyle={{}}
            onPress={() => {
              /* TEMPORARY, REPLACE WITH INFORMATION PAGE */
              alert(`${street} ${number}, ${zone}. Codigo Postal ${postal}.`);
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
            size={25}
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

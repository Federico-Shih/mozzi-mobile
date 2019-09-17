import {
  Text,
  View,
  Platform,
  Alert,
  TouchableHighlight,
  TouchableNativeFeedback,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, { Component } from 'react';
import { Divider, Button, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getAppointments,
  removeAppointments,
} from '../libraries/connect/appointments';
import styles from '../libraries/styles/styles';
import {
  getUsableTimeFormat as hour,
  sendPopup,
  newTime,
  units,
} from '../libraries/helpers';
import { platformBackColor } from '../libraries/styles/constants';
import { ADD_BUSINESS_UUID } from '../actions';

type Props = {};

const {
  vmax, vmin, vh, vw,
} = units;

const TouchButton = Platform.select({
  ios: TouchableHighlight,
  android: TouchableNativeFeedback,
});

class MyAppointments extends Component<Props> {
  state = {
    appointments: new Map(),
    refreshing: false,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
    }).isRequired,
  };

  componentDidMount = () => {
    this.loadAppointments();
  };

  loadAppointments = async () => {
    const { token } = this.props;
    const { data } = await getAppointments({ token });
    console.log(data);
    if (data.errors) {
      data.errors.forEach((el) => {
        sendPopup(el.message);
      });
    }
    const appointments = new Map();
    data.data.me.appointments.forEach((appointment) => {
      appointments.set(appointment.uuid, appointment);
    });
    this.setState({ appointments });
  };

  appointmentDelete = async (appointment) => {
    const { token } = this.props;
    const confirmar = await this.showAlert(appointment);
    if (confirmar) {
      const resultsAPI = await removeAppointments({
        token,
        uuid: appointment.uuid,
      });
      console.log(resultsAPI);
      if (resultsAPI.data.data.appointmentDelete === '0') {
        this.setState((state) => {
          const newMap = state.appointments;
          newMap.delete(appointment.uuid);
          return newMap;
        });
      } else if (resultsAPI.data.errors) {
        resultsAPI.data.errors.forEach((el) => {
          sendPopup(el.message);
        });
      } else {
        sendPopup('El servidor no ha respondido');
      }
    }
  };

  navToStore = (uuid) => {
    const { navigateToBusiness, navigation } = this.props;
    navigateToBusiness(uuid);
    navigation.navigate('Business');
  };

  showAlert = appointment => new Promise((resolve) => {
    const { service, slot } = appointment;
    Alert.alert(
      'Confirmar',
      `Confirmas la eliminación del servicio de ${service.name} del negocio ${
        service.business.name
      } de la fecha ${new Date(
        slot.day * 24 * 60 * 60 * 1000 + slot.start * 60 * 1000,
      ).toDateString()} desde las ${newTime(
        0,
        slot.start,
      )} hasta las ${newTime(0, slot.finish)}?`,
      [
        { text: 'Cancelar', onPress: () => resolve(false), style: 'cancel' },
        { text: 'Eliminar', onPress: () => resolve(true) },
      ],
    );
  });

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.loadAppointments();
    this.setState({
      refreshing: false,
    });
  };

  render() {
    const { navigation } = this.props;
    const { appointments, refreshing } = this.state;
    const arrayAppointments = Array.from(appointments.values());
    arrayAppointments.sort((a, b) => a.slot.day - b.slot.day);
    return (
      <View contentContainerStyle={styles.container}>
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
            navigation.goBack();
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
        <View
          style={{
            width: 100 * vw,
            fontSize: 36,
            paddingTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 36,
              paddingLeft: 20,
            }}
          >
            Turnos
          </Text>
          <Divider style={{ height: 2, width: 100 * vw, marginLeft: 20 }} />
          <View style={{ width: 100 * vw, height: 80 * vh }}>
            <FlatList
              data={arrayAppointments}
              refreshControl={(
                <RefreshControl
                  colors={['#9Bd35A', '#689F38']}
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                />
)}
              keyExtractor={item => item.uuid}
              renderItem={({ item }) => (
                <View
                  key={item.uuid}
                  style={{ flexDirection: 'column', paddingLeft: 20 }}
                >
                  <TouchButton
                    onPress={() => {
                      this.navToStore(item.service.business.uuid);
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          paddingLeft: 5,
                        }}
                      >
                        <Text style={{ paddingTop: 5, fontSize: 20 }}>
                          {item.service.business.name}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            style={{
                              fontSize: 14,
                              width: 100,
                              alignSelf: 'center',
                            }}
                          >
                            {item.service.name}
                          </Text>
                          <Text style={{ alignSelf: 'center', fontSize: 20 }}>
                            {`$${item.service.price}`}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flex: 1 }} />
                      <View
                        style={{
                          flexDirection: 'column',
                          marginRight: 10,
                          justifyContent: 'center',
                        }}
                      >
                        <Text>
                          {new Date(
                            item.slot.day * 24 * 60 * 60 * 1000
                              + item.slot.start * 60 * 1000,
                          ).toDateString()}
                        </Text>
                        <Text>
                          {`${newTime(0, item.slot.start)}~${newTime(
                            0,
                            item.slot.finish,
                          )}`}
                        </Text>
                      </View>
                      <Icon
                        name="clear"
                        type="material"
                        containerStyle={{
                          justifyContent: 'center',
                          marginRight: 10,
                        }}
                        iconStyle={{
                          paddingHorizontal: 15,
                          paddingVertical: 15,
                          borderRadius: 50,
                        }}
                        onPress={() => {
                          this.appointmentDelete(item);
                        }}
                      />
                    </View>
                  </TouchButton>
                  <Divider style={{ width: '100%' }} />
                </View>
              )}
            />
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading,
    token: state.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToBusiness: (uuid) => {
      dispatch({
        type: ADD_BUSINESS_UUID,
        uuid,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyAppointments);

/*
{
    business: {
      name: 'Hola',
      street: 'Nunez',
      number: 2757,
    },
    uuid: '10sasdi',
    start: 20,
    end: 10,
    service: {
      name: 'Mis',
      price: 20,
    },
  },

*/

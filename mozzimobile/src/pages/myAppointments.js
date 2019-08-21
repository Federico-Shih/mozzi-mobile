import {
  Text, View, Platform, Alert,
} from 'react-native';
import React, { Component } from 'react';
import { Divider, Button, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import newUUID from 'uuid';

import {
  getAppointments,
  removeAppointments,
} from '../libraries/connect/appointments';
import styles from '../libraries/styles/styles';
import { getUsableTimeFormat as hour, sendPopup } from '../libraries/helpers';
import { platformBackColor } from '../libraries/styles/constants';

type Props = {};

class Buscador extends Component<Props> {
  state = {
    appointments: new Map(),
  };

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
    }).isRequired,
  };

  componentDidMount = () => {
    const { token } = this.props;
    const tempApps = getAppointments({ token });
    const appointments = new Map();
    tempApps.forEach((appointment) => {
      appointments.set(appointment.uuid, appointment);
    });
    this.setState({ appointments });
  };

  appointmentDelete = async (appointment) => {
    const { token } = this.props;
    const confirmar = await this.showAlert(appointment);
    if (confirmar) {
      const resultsAPI = removeAppointments({ token, uuid: appointment.uuid });
      if (resultsAPI) {
        this.setState((state) => {
          const newMap = state.appointments;
          newMap.delete(appointment.uuid);
          return newMap;
        });
      } else {
        sendPopup('El servidor no ha respondido');
      }
    }
  };

  showAlert = appointment => new Promise((resolve) => {
    const {
      business, start, end, service,
    } = appointment;
    Alert.alert(
      'Confirmar',
      `Confirmas la eliminación del servicio de ${service.name} del negocio ${
        business.name
      } de la fecha ${new Date(start).toDateString()} desde las ${hour(
        start,
      )} hasta las ${hour(end)}?`,
      [
        { text: 'Cancelar', onPress: () => resolve(false), style: 'cancel' },
        { text: 'Eliminar', onPress: () => resolve(true) },
      ],
    );
  });

  render() {
    const { navigation } = this.props;
    const { appointments } = this.state;
    const arrayAppointments = Array.from(appointments.values());

    return (
      <View style={styles.container}>
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
            width: '100%',
            paddingLeft: 20,
            fontSize: 36,
            paddingTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 36,
            }}
          >
            Turnos
          </Text>
          <Divider style={{ height: 2, width: '100%' }} />
          {arrayAppointments.map(val => (
            <View key={newUUID()} style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    flexDirection: 'column',
                    paddingLeft: 5,
                  }}
                >
                  <Text style={{ paddingTop: 5, fontSize: 20 }}>
                    {val.business.name}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        fontSize: 14,
                        width: 100,
                        alignSelf: 'center',
                      }}
                    >
                      {val.service.name}
                    </Text>
                    <Text style={{ alignSelf: 'center', fontSize: 20 }}>
                      {`$${val.service.price}`}
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
                  <Text>{new Date(val.start).toDateString()}</Text>
                  <Text>{`${hour(val.start)}~${hour(val.end)}`}</Text>
                </View>
                <Icon
                  name="clear"
                  type="material"
                  containerStyle={{
                    justifyContent: 'center',
                    marginRight: 10,
                  }}
                  iconStyle={{
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 50,
                  }}
                  onPress={() => {
                    this.appointmentDelete(val);
                  }}
                />
              </View>
              <Divider style={{ width: '100%' }} />
            </View>
          ))}
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
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Buscador);

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

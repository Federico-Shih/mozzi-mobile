import {
  Text,
  View,
  Platform,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableNativeFeedback,
  FlatList,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { Component } from 'react';
import {
  Divider, Button, Icon,
  SearchBar,
  Image,
  Header,
} from 'react-native-elements';
import PropTypes, { array } from 'prop-types';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';

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
import buttonStyle from '../libraries/styles/button-styles';

const noAppointment = require('../assets/images/noAppointment.png');

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
    loaded: false,
    show: false,
    toRemove: {
      service: '',
      slot: '',
    },
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
    try {
      const { data } = await getAppointments({ token });
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
    } catch (e) {
      alert(JSON.stringify(e));
    }
    this.setState({ loaded: true });
  };

  appointmentDelete = async (appointment) => {
    const { token } = this.props;
    const resultsAPI = await removeAppointments({
      token,
      uuid: appointment.uuid,
    });
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
  };

  navToStore = (uuid) => {
    const { navigateToBusiness, navigation } = this.props;
    navigateToBusiness(uuid);
    navigation.navigate('Business');
  };

  dismissModal = () => {
    this.setState({ show: false });
  }

  showAlert = (appointment) => {
    this.setState({ show: true, toRemove: appointment });
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.loadAppointments();
    this.setState({
      refreshing: false,
    });
  };

  displayAppointmentContent = (appointmentList) => {
    const { loaded, refreshing } = this.state;

    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAAAAA" />
        </View>
      );
    }

    if (appointmentList.length !== 0) {
      return (
        <FlatList
          data={appointmentList}
          refreshControl={(
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
)}
          keyExtractor={item => item.uuid}
          renderItem={({ item }) => {
            const date = new Date(
              item.slot.day * 24 * 60 * 60 * 1000
          + item.slot.start * 60 * 1000,
            );

            return (
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
                        paddingLeft: 30,
                      }}
                    >
                      <Text style={{ paddingTop: 5, fontSize: 20, color: 'black' }}>
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
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text>
                          {`${date.getDate()}/${date.getMonth() + 1} `}
                        </Text>
                        <Text>
                          {`${newTime(0, item.slot.start)}hs`}
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
                      <Text style={{
                        alignSelf: 'center', fontSize: 20, color: 'black', fontFamily: 'Nunito-SemiBold',
                      }}
                      >
                        {`$${item.service.price}`}
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
                        this.showAlert(item);
                      }}
                    />
                  </View>
                </TouchButton>
                <Divider style={{ width: '100%' }} />
              </View>
            );
          }}
        />
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={(
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
)}
        >
          <View style={{
            flex: 1, height: 80 * vh, justifyContent: 'center', alignItems: 'center', marginBottom: 30,
          }}
          >
            <Image
              style={{ width: 30 * vw, height: 30 * vw }}
              source={noAppointment}
            />
            <Text style={{ fontFamily: 'Nunito-SemiBold', fontSize: 25, color: 'black' }}>
              No tienes turnos todavía
            </Text>
            <Text style={{ fontFamily: 'Nunito-SemiBold' }}>
              Empeza a agendar!
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  toggle() {
    const { navigation } = this.props;
    navigation.openDrawer();
  }

  render() {
    const { appointments, show, toRemove } = this.state;
    const { service, slot } = toRemove;
    const arrayAppointments = Array.from(appointments.values());
    arrayAppointments.sort((a, b) => a.slot.day - b.slot.day);
    return (
      <View contentContainerStyle={styles.container}>
        <View>
          <Modal
            animationType="fade"
            visible={show}
            transparent
            onDismiss={() => { this.dismissModal(); }}
            onRequestClose={() => { this.dismissModal(); }}
          >
            <TouchableWithoutFeedback
              onPress={() => { this.dismissModal(); }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                  width: 100 * vw,
                  backgroundColor: 'rgba(100, 100, 100, 0.7)',
                  flex: 1,
                }}
              >
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      width: 90 * vw,
                      height: 300,
                      backgroundColor: 'white',
                      borderRadius: 15,
                      alignSelf: 'center',
                      alignItems: 'center',
                      borderColor: '#ff1e00',
                      borderWidth: 3,
                    }}
                  >
                    <View style={{
                      margin: 38, alignItems: 'flex-start', height: 240, width: 72 * vw,
                    }}
                    >
                      <Text style={{ fontFamily: 'Nunito-SemiBold', fontSize: 18, color: 'black' }}>Confirmás la eliminación del turno</Text>
                      <Text style={{
                        color: 'black', fontSize: 22, fontFamily: 'Nunito-SemiBold', marginTop: 20,
                      }}
                      >
                        {`${service.name},`}

                      </Text>
                      <Text style={{ fontSize: 22, fontFamily: 'Nunito-SemiBold' }}>
                        {`del día ${new Date(
                          slot.day * 24 * 60 * 60 * 1000 + slot.start * 60 * 1000,
                        ).toLocaleDateString('es-ES', { dateStyle: 'full' })} desde las ${newTime(
                          0,
                          slot.start,
                        )} hasta las ${newTime(0, slot.finish)} hs`}
                      </Text>
                      <Button
                        onPress={() => {
                          this.appointmentDelete(toRemove);
                          this.dismissModal();
                        }
}
                        titleStyle={{ ...buttonStyle.reglogButtonText, fontSize: 17 }}
                        buttonStyle={{ ...buttonStyle.reglogButton, width: 72 * vw, backgroundColor: '#ff1e00' }}
                        containerStyle={{
                          marginTop: 4 * vh,
                          alignSelf: 'center',
                        }}
                        raised
                        type="outline"
                        title="Confirmar"
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
        <NavigationEvents
          onWillFocus={(payload) => {
            if (payload.action.type === 'Navigation/NAVIGATE') {
              this.loadAppointments();
            }
          }}
        />
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
        <View
          style={{
            width: 100 * vw,
            fontSize: 36,
            paddingTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              paddingLeft: 20,
              paddingBottom: 21,
              fontFamily: 'Nunito-SemiBold',
              color: 'black',
            }}
          >
            Mis Turnos
          </Text>
          <Divider style={{ height: 1, width: 100 * vw, marginLeft: 20 }} />
          <ScrollView style={{ width: 100 * vw, height: 80 * vh }}>
            {
              this.displayAppointmentContent(arrayAppointments)
            }
          </ScrollView>
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

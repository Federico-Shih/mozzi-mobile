import {
  Text,
  View,
  FlatList,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Icon, Button, Divider, Image,
} from 'react-native-elements';
import keyUUID from 'uuid';
import Timeline from 'react-native-timeline-feed';

import { platformBackColor } from '../libraries/styles/constants';
import { REMOVE_SERVICE, LOADING } from '../actions';
import styles from '../libraries/styles/styles';
import {
  getServiceTimes,
  sendAppointment,
} from '../libraries/connect/businessCalls';
import { errorMessages, sendPopup, newTime, units } from '../libraries/helpers';

const { vh, vw } = units;

type Props = {};

const days = ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab'];

function toDateString(date) {
  return days[date.getDay()];
}

function getNextDay(nDays) {
  const date = new Date();
  return new Date(date.setSeconds(date.getSeconds() + 60 * 60 * 24 * nDays));
}

function Box(props) {
  const { element } = props;
  return (
    <View style={{
      width: '100%', height: '100%', alignItems: 'center', flexDirection: 'column', justifyContent: 'center',
    }}
    >
      <Text style={{ color: 'white', fontSize: 5 * vw }}>{toDateString(element.date)}</Text>
      <Text style={{ fontSize: 5 * vw, color: 'white' }}>
        {element.date.getDate()}
      </Text>
    </View>
  );
}

function ShowImage({ length }) {
  const imageSource = require('../assets/shisus.jpg');
  if (length > 0) {
    return null;
  }
  return (
    <Image
      source={imageSource}
      style={{ alignSelf: 'center', marginTop: vh * 15 }}
    />
  );
}

Box.propTypes = {
  element: PropTypes.object.isRequired,
};

class CalendarPage extends Component<Props> {
  state = {
    dates: [],
    selectedDate: '',
    data: [],
    selectedTime: '',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
      navigate: PropTypes.func,
      pop: PropTypes.func,
    }).isRequired,
    uuid: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    setLoading: PropTypes.func.isRequired,
  };
  // { title: 'Title Text', key: 'item5', style: styles.dateStyle },

  componentDidMount = async () => {
    const { service, token } = this.props;
    const dates = new Map();

    let initialDate;
    for (let i = 0; i < 20; i += 1) {
      const date = getNextDay(i + 1);
      const thisUuid = keyUUID();
      const objectDate = { date, key: thisUuid, selected: i === 0 };
      if (i === 0) initialDate = objectDate;
      dates.set(thisUuid, objectDate);
    }
    const data = await getServiceTimes({
      service,
      token,
      day: initialDate,
    });
    this.checkForErrors(data);
    this.setState({ dates, selectedDate: initialDate, data });
  };

  checkForErrors = (data) => {
    if (!(data instanceof Map)) {
      data.data.errors.forEach((element) => {
        sendPopup(element.message);
      });
    }
  }

  updateSlots = async (selectedDate) => {
    const { service, token } = this.props;
    const data = await getServiceTimes({
      service,
      token,
      day: selectedDate,
    });
    this.checkForErrors(data);
    this.setState({ data, selectedTime: '' });
  }

  selectDate = async (newDate) => {
    const { dates, selectedDate } = this.state;

    if (selectedDate.key !== newDate.key) {
      const newDates = dates;
      newDates.set(newDate.key, {
        ...newDates.get(newDate.key),
        selected: true,
      });

      newDates.set(selectedDate.key, {
        ...newDates.get(selectedDate.key),
        selected: false,
      });
      this.setState({ selectedDate: newDate, dates: newDates });
      this.updateSlots(newDate);
    }
  };

  showAlert = ({ selectedTime, selectedDate }) => new Promise((resolve, reject) => {
    Alert.alert(
      'Confirmar',
      `Confirmas el turno reservado el dia ${selectedDate.date.toLocaleDateString('es-ES', { dateStyle: 'full' })} a las ${
        selectedTime.time
      }`,
      [
        { text: 'Cancelar', onPress: () => resolve(false), style: 'cancel' },
        { text: 'Confirmar', onPress: () => resolve(true) },
      ],
    );
  });

  saveAppointment = async () => {
    const {
      setLoading, token, navigation,
    } = this.props;
    const { selectedDate, selectedTime } = this.state;

    setLoading(true);
    if (selectedDate === '') {
      sendPopup(errorMessages.noDateSelected);
    } else if (selectedTime === '') {
      sendPopup(errorMessages.noTimeSelected);
    } else {
      try {
        const confirm = await this.showAlert(this.state);
        if (confirm) {
          const saved = await sendAppointment({
            token,
            slot: selectedTime.key,
          });
          if (!('errors' in saved.data)) navigation.pop(2);
          else {
            saved.data.errors.forEach((el) => {
              sendPopup(el.message);
            });
          }
        }
      } catch (e) {
        sendPopup('Alert error');
      }
    }
    setLoading(false);
  };

  selectTime = (newTime) => {
    const { data, selectedTime } = this.state;
    if (
      !newTime.selected
      && !newTime.occupied
      && !(newTime.key === selectedTime.key)
    ) {
      const newTimes = data;
      data.set(newTime.index, { ...data.get(newTime.index), selected: true });
      if (selectedTime !== '') {
        data.set(selectedTime.index, {
          ...data.get(selectedTime.index),
          selected: false,
        });
      }
      this.setState({ selectedTime: newTime, data: newTimes });
    }
  };

  render() {
    const { navigation } = this.props;
    const { dates, data } = this.state;
    const mapDates = (dates instanceof Map) ? Array.from(dates.values()) : [];
    const mapTimes = (data instanceof Map) ? Array.from(data.values()) : [];
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: platformBackColor,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Icon
          name={Platform.select({
            ios: 'arrow-back-ios',
            android: 'arrow-back',
          })}
          size={25}
          onPress={() => navigation.goBack()}
          color="black"
          containerStyle={{
            borderRadius: 50,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginLeft: 5,
            marginTop: 5,
          }}
          iconStyle={{
            padding: 8,
          }}
          underlayColor="rgba(1,1,1, 0.2)"
        />

        <View
          style={{
            height: vh * 15,
            marginLeft: 20,
          }}
        >
          <FlatList
            data={mapDates}
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{}}
            renderItem={({ item }) => {
              const style = item.selected
                ? styles.dateStyleSelected
                : styles.dateStyle;
              return Platform.select({
                ios: (
                  <TouchableOpacity onPress={() => this.selectDate(item.date)}>
                    <View style={item.style}>
                      <Box element={item} />
                    </View>
                  </TouchableOpacity>
                ),
                android: (
                  <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#CCC')}
                    onPress={() => this.selectDate(item)}
                  >
                    <View style={style}>
                      <Box element={item} />
                    </View>
                  </TouchableNativeFeedback>
                ),
              });
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Divider />
          <ShowImage length={mapTimes.length} />
          <Timeline
            data={mapTimes}
            style={{ marginHorizontal: 20 }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(element) => {
              const {
                props, item, isLast, index, key,
              } = element;
              let frameStyle = styles.timeFrame;

              if (item.occupied) {
                frameStyle = {
                  ...styles.timeFrame,
                  ...styles.timeFrameOccupied,
                };
              }

              if (item.selected) {
                frameStyle = {
                  ...styles.timeFrame,
                  ...styles.timeFrameSelected,
                };
              }

              if (item.end) {
                return (
                  <View style={{ width: '100%', paddingVertical: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontFamily: 'Nunito-SemiBold' }}>{`${newTime(0, item.end)} - ${newTime(0, item.start)}`}</Text>
                  </View>
                );
              }

              const firstPadding = index === 0 ? 5 : 0;
              return (
                <View
                  key={key}
                  style={{
                    flexDirection: 'row',
                    paddingTop: firstPadding,
                    width: '100%',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: 'rgba(50, 50, 200, 0.3)',
                      borderRadius: 20,
                      height: 25,
                      paddingVertical: 5,
                      paddingHorizontal: 5,
                      alignItems: 'center',
                      marginRight: 5,
                      top: -2,
                    }}
                  >
                    <Text>{item.time}</Text>
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    <View
                      style={{
                        backgroundColor: props.circleColor,
                        width: 20,
                        height: 20,
                        borderRadius: 50,
                      }}
                    />

                    <View
                      style={{
                        backgroundColor: (isLast || item.isLast)
                          ? 'transparent'
                          : props.lineColor,
                        width: props.lineWidth,
                        height: 50,
                        marginLeft: 9,
                      }}
                    />
                  </View>
                  {Platform.select({
                    ios: (
                      <TouchableOpacity
                        style={styles.timeSelectorButton}
                        onPress={() => {
                          this.selectTime(item);
                        }}
                      >
                        <View style={frameStyle}>
                          <Divider style={{ height: 1, backgroundColor: '#AAAAAA' }} />
                        </View>
                      </TouchableOpacity>
                    ),
                    android: (
                      <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#CCC')}
                        onPress={() => {
                          this.selectTime(item);
                        }}
                        style={{}}
                      >
                        <View style={frameStyle}>
                          <Divider style={{ height: 1, backgroundColor: '#AAAAAA' }} />
                        </View>
                      </TouchableNativeFeedback>
                    ),
                  })}
                </View>
              );
            }}
          />
          <Divider />

          <Button
            containerStyle={{
              width: 80,
              height: 80,
              marginTop: 20,
              borderWidth: 1,
              borderColor: 'transparent',
              borderRadius: 50,
              backgroundColor: 'white',
              alignSelf: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
              elevation: 10,
              position: 'absolute',
              bottom: 35,
              right: 35,
            }}
            icon={(
              <Icon
                name="done"
                size={60}
                color="#5819E0"
              />
            )}
            onPress={this.saveAppointment}
            buttonStyle={{ height: '100%', width: '100%', backgroundColor: 'transparent' }}
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
    service: state.service,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeService: () => {
      dispatch({
        type: REMOVE_SERVICE,
      });
    },
    setLoading: (loading) => {
      dispatch({
        type: LOADING,
        loading,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalendarPage);

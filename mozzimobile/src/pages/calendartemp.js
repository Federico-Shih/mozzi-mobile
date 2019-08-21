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
import { Icon, Button, Divider } from 'react-native-elements';
import keyUUID from 'uuid';
import Timeline from 'react-native-timeline-feed';

import { Popup } from '../libraries/props';
import { platformBackColor } from '../libraries/styles/constants';
import { REMOVE_SERVICE, LOADING } from '../actions';
import styles from '../libraries/styles/styles';
import {
  getServiceTimes,
  sendAppointment,
} from '../libraries/connect/businessCalls';
import { errorMessages } from '../libraries/helpers';

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
    <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
      <Text style={{ paddingTop: 20 }}>{toDateString(element.date)}</Text>
      <Text style={{ marginTop: 5, fontSize: 20, color: 'black' }}>
        {element.date.getDate()}
      </Text>
    </View>
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

  time = '';

  popupMessage = { title: '', message: '', previousMessage: '' };

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

  componentDidMount = () => {
    const { uuid, service, token } = this.props;
    const dates = new Map();

    let initialDate;
    for (let i = 0; i < 20; i += 1) {
      const date = getNextDay(i + 1);
      const thisUuid = keyUUID();
      const objectDate = { date, key: thisUuid, selected: i === 0 };
      if (i === 0) initialDate = objectDate;
      dates.set(thisUuid, objectDate);
    }

    const data = getServiceTimes({
      service,
      uuid,
      token,
      selectedDate: initialDate,
    });
    this.setState({ dates, selectedDate: initialDate, data });
  };

  selectDate = (newDate) => {
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
    }
  };

  displayPopup = () => {
    if (this.popupMessage.message) {
      return <Popup message={this.popupMessage.message} init />;
    }
    if (!this.popupMessage.message && this.popupMessage.previousMessage) {
      return <Popup message={this.popupMessage.previousMessage} init={false} />;
    }
    return null;
  };

  showAlert = ({ selectedTime, selectedDate }) => new Promise((resolve, reject) => {
    Alert.alert(
      'Confirmar',
      `Confirmas el turno reservado el dia ${selectedDate.date} a las ${
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
      setLoading, uuid, service, token, navigation,
    } = this.props;
    const { selectedDate, selectedTime } = this.state;

    setLoading(true);
    if (selectedDate === '') {
      this.sendPopup('No seleccionaste dia', errorMessages.noDateSelected);
    } else if (selectedTime === '') {
      this.sendPopup('Fecha', errorMessages.noTimeSelected);
    } else {
      try {
        const confirm = await this.showAlert(this.state);
        if (confirm) {
          const saved = await sendAppointment({
            uuid,
            service,
            token,
            date: selectedDate,
            time: selectedTime,
          });
          if (saved) navigation.pop(2);
        }
      } catch (e) {
        this.sendPopup('ALERTERROR', 'Alert error');
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
    const mapDates = Array.from(dates.values());
    const mapTimes = Array.from(data.values());
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: platformBackColor,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
        onStartShouldSetResponder={() => {
          this.resetErrorPopup(true);
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
            height: '15%',
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
        <View style={{ height: '70%' }}>
          <Divider />
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
                        backgroundColor: isLast
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
                        <View style={frameStyle} />
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
                          <Divider />
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
              height: 50,
              width: 100,
              marginTop: 20,
              alignSelf: 'center',
            }}
            onPress={this.saveAppointment}
            buttonStyle={{ height: '100%', width: '100%' }}
            title="Reserva!"
          />
        </View>
        <View style={{ flex: 1 }} />
        <View>{this.displayPopup()}</View>
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

/*
<Timeline
          data={data}
          preset={Preset.SingleColumnRight}
          style={{
            top: 20,
            marginBottom: 20,
            width: '100%',
          }}
          rowStyle={{ width: 100 }}
          renderDetail={(rowData) => {

            const { key } = rowData;

          }}

        />
*/

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

import {
  Text,
  View,
  FlatList,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Button, Divider } from 'react-native-elements';
import keyUUID from 'uuid';
import Timeline from 'react-native-timeline-feed';

import { Preset } from 'react-native-timeline-feed/lib/Types';
import { platformBackColor } from '../libraries/styles/constants';
import { REMOVE_SERVICE } from '../actions';
import styles from '../libraries/styles/styles';
import { getServiceTimes } from '../libraries/connect/businessCalls';

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

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
    uuid: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
  };
  // { title: 'Title Text', key: 'item5', style: styles.dateStyle },

  componentDidMount = () => {
    const { uuid, service, token } = this.props;
    const dates = new Map();

    let initialDate;
    for (let i = 0; i < 30; i += 1) {
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

  selectTime = (newTime) => {
    const { data, selectedTime } = this.state;

    if (!newTime.selected && !newTime.occupied && !(newTime.key === selectedTime.key)) {
      const newTimes = data;
      data.set(newTime.key, { ...data.get(newTime.key), selected: true });

      if (selectedTime.time) {
        data.set(selectedTime.key, { ...data.get(selectedTime.key), selected: false });
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
          height: '100%',
          width: '100%',
          backgroundColor: platformBackColor,
          flexDirection: 'column',
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
        <View style={{ height: '80%' }}>
          <Divider />
          <Timeline
            data={mapTimes}
            style={{ marginHorizontal: 20, marginBottom: 100 }}
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
                    {!isLast ? (
                      <View
                        style={{
                          backgroundColor: props.lineColor,
                          width: props.lineWidth,
                          height: 50,
                          marginLeft: 9,
                        }}
                      />
                    ) : null}
                  </View>
                  {Platform.select({
                    ios: (
                      <TouchableOpacity
                        style={styles.timeSelectorButton}
                        onPress={() => {
                          this.selectTime(item);
                        }}
                        key={key}
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
                        key={key}
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
          <Divider style={{ bottom: 100 }} />
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalendarPage);

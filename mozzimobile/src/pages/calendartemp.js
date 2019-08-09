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
import { Icon, Button } from 'react-native-elements';
import keyUUID from 'uuid';
import Timeline from 'react-native-timeline-listview';

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
    data: [
      { time: '09:00', title: 'Event 1', description: 'Event 1 Description' },
      { time: '10:45', title: 'Event 2', description: 'Event 2 Description' },
      { time: '12:00', title: 'Event 3', description: 'Event 3 Description' },
      { time: '14:00', title: 'Event 4', description: 'Event 4 Description' },
      { time: '16:30', title: 'Event 5', description: 'Event 5 Description' },
    ],
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
    const dates = [];

    let initialDate;
    for (let i = 0; i < 30; i += 1) {
      const date = getNextDay(i + 1);
      const objectDate = { date, key: keyUUID(), selected: (i === 0) };
      if (i === 0) initialDate = objectDate;
      dates.push(objectDate);
    }

    this.setState({ dates, selectedDate: initialDate });
    const { selectedDate } = this.state;

    const data = getServiceTimes({
      service,
      uuid,
      token,
      selectedDate,
    });
    alert(data[0].time)
    this.setState({ data });
  };

  selectDate = (newDate) => {
    const { dates, selectedDate } = this.state;

    if (selectedDate.key !== newDate.key) {
      const index = dates.findIndex(obj => obj.key === newDate.key);
      const newDates = dates;
      newDates[index] = { ...dates[index], selected: true };

      if (selectedDate !== '') {
        const oldIndex = dates.findIndex(obj => obj.key === selectedDate.key);
        newDates[oldIndex] = { ...dates[oldIndex], selected: false };
      }
      this.setState({ selectedDate: newDate, dates: newDates });
    }
  };

  render() {
    const { navigation } = this.props;
    const { dates, data } = this.state;
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: platformBackColor,
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
            data={dates}
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{}}
            renderItem={({ item }) => {
              const style = (item.selected) ? styles.dateStyleSelected : styles.dateStyle;
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
            }
            }
          />
        </View>
        <Timeline
          data={data}
          style={{ top: 20, alignSelf: 'center', width: '100%' }}
          rowContainerStyle={{ width: '95%' }}
          renderDetail={(rowData, sectionID, rowID) => {
            return Platform.select({
              ios: (
                <TouchableOpacity
                  style={styles.timeSelectorButton}
                  onPress={() => {}}
                >
                  <Text> lol </Text>
                </TouchableOpacity>
              ),
              android: (
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple('#CCC')}
                  onPress={() => {}}
                >
                  <View
                    style={{ backgroundColor: 'rgba(0,0,0, .05)', height: 100 }}
                  >
                    <Text style={{}}> lol </Text>
                  </View>
                </TouchableNativeFeedback>
              ),
            });
          }}
        />
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalendarPage);

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
import { Icon } from 'react-native-elements';
import uuid from 'uuid';

import { platformBackColor } from '../libraries/styles/constants';
import { REMOVE_SERVICE } from '../actions';
import styles from '../libraries/styles/styles';

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
      <Text style={{ marginTop: 5, fontSize: 20, color: 'black' }}>{element.date.getDate()}</Text>
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
  };

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  }
  // { title: 'Title Text', key: 'item5', style: styles.dateStyle },

  componentDidMount = () => {
    const dates = [];
    for (let i = 0; i < 30; i += 1) {
      const date = getNextDay(i);
      dates.push({ date, key: uuid(), style: styles.dateStyle });
    }
    this.setState({ dates });
  };

  selectDate = (newDate) => {
    const { dates, selectedDate } = this.state;

    if (selectedDate !== newDate) {
      const index = dates.findIndex(obj => obj.key === newDate.key);
      const newDates = dates;
      newDates[index] = { ...dates[index], style: styles.dateStyleSelected };
      console.log(index);

      if (selectedDate !== '') {
        const oldIndex = dates.findIndex(obj => obj.key === selectedDate.key);
        console.log(oldIndex);
        newDates[oldIndex] = { ...dates[oldIndex], style: styles.dateStyle };
      }
      this.setState({ selectedDate: newDate, dates: newDates });
    }
  };

  render() {
    const { navigation } = this.props;
    const { dates } = this.state;
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: platformBackColor,
        }}
      >
        <Icon
          name={Platform.select({ ios: 'arrow-back-ios', android: 'arrow-back' })}
          size={25}
          onPress={navigation.goBack}
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
            renderItem={({ item }) => Platform.select({
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
                  <View style={item.style}>
                    <Box element={item} />
                  </View>
                </TouchableNativeFeedback>
              ),
            })
            }
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalendarPage);

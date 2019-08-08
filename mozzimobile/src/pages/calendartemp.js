import {
  Text,
  View,
  FlatList,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { platformBackColor } from '../libraries/styles/constants';
import { REMOVE_SERVICE } from '../actions';
import styles from '../libraries/styles/styles';

type Props = {};

function Date(props) {
  const { element } = props;
  return (
    <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
      <Text style={{ paddingTop: 10 }}>{element.title}</Text>
    </View>
  );
}

class CalendarPage extends Component<Props> {
  state = {};

  componentDidMount = () => {};

  render() {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: platformBackColor,
        }}
      >
        <View
          style={{
            height: '15%',
          }}
        >
          <FlatList
            data={[
              { title: 'Title Text', key: 'item1' },
              { title: 'Title Text', key: 'item2' },
              { title: 'Title Text', key: 'item3' },
              { title: 'Title Text', key: 'item4' },
              { title: 'Title Text', key: 'item5' },
              { title: 'Title Text', key: 'item6' },
              { title: 'Title Text', key: 'item1s' },
              { title: 'Title Text', key: 'item2s' },
              { title: 'Title Text', key: 'item3s' },
              { title: 'Title Text', key: 'item4s' },
              { title: 'Title Text', key: 'item5s' },
              { title: 'Title Text', key: 'item6s' },
            ]}
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{}}
            renderItem={({ item }) => Platform.select({
              ios: (
                <TouchableOpacity onPress={() => {}}>
                  <View style={styles.dateStyle}>
                    <Date element={item} />
                  </View>
                </TouchableOpacity>
              ),
              android: (
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple('#DDD')}
                  conta
                  onPress={() => {}}
                >
                  <View style={styles.dateStyle}>
                    <Date element={item} />
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

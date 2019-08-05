import { Text, View } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from '../libraries/styles/styles';
import { LOADING, REMOVE_BUSINESS_UUID } from '../actions';

type Props = {};

class Business extends Component<Props> {
  state = {};

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Business</Text>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading,
    token: state.token,
    uuid: state.businessUuid,
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
    navigateToBusiness: () => {
      dispatch({
        type: REMOVE_BUSINESS_UUID,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Business);

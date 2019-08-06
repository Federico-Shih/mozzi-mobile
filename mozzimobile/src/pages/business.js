import { Text, View } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Image, Divider } from 'react-native-elements';

import styles from '../libraries/styles/styles';
import { LOADING, REMOVE_BUSINESS_UUID } from '../actions';
import { getBusiness } from '../libraries/connect/businessCalls';

type Props = {};

class Business extends Component<Props> {
  state = {
    business: {},
  };

  static propTypes = {
    token: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  }

  componentDidMount = () => {
    /*
    basic catch and then
    */
    const { token, uuid } = this.props;
    const business = getBusiness({ token, uuid });
    this.setState({ business });

  }

  render() {
    const { business } = this.state;
    return (
      <View style={styles.container}>
        <View style={{width: '100%', flexDirection: 'row', marginLeft: 40, marginTop: 20 }}>
          <Image
            source={{ uri: business.image }}
            style={{ width: 100, height: 100, borderWidth: 30 }}
          />
          <View style={{ marginLeft: 20, }}>
            <View>
              <Text style={{ fontSize: 30 }}>{business.name}</Text>
              <Divider style={{ height: 1 }} />
            </View>
            <Text numberOfLines={3} style={{ fontSize: 15, width: '90%' }}>{business.description}</Text>
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

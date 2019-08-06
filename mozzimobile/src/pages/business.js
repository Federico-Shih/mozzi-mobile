import { Text, View } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Image, Divider, Button, Icon,
} from 'react-native-elements';

import { ScrollView } from 'react-native-gesture-handler';
import styles from '../libraries/styles/styles';
import { LOADING, REMOVE_BUSINESS_UUID } from '../actions';
import { getBusiness } from '../libraries/connect/businessCalls';

type Props = {};

class Business extends Component<Props> {
  state = {
    business: {
      name: '',
      street: '',
      number: null,
      description: '',
      zone: '',
      services: [],
      image: null,
    },
  };

  static propTypes = {
    token: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  };

  componentDidMount = () => {
    /*
    basic catch and then
    */
    const { token, uuid } = this.props;
    const business = getBusiness({ token, uuid });
    this.setState({ business });
    console.log(this.state);
  };

  render() {
    const { business } = this.state;
    const { token, uuid } = this.props;
    return (
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: business.image }}
            style={{
              width: 1000,
              height: 160,
              borderWidth: 30,
              resizeMode: 'contain',
              opacity: 0.9,
            }}
            containerStyle={{ backgroundColor: 'black' }}
          />
          <View
            style={{
              marginTop: 10,
              alignItems: 'flex-start',
              width: '100%',
              marginLeft: 20,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '800' }}> Servicios </Text>
            <Divider
              style={{
                marginBottom: 8,
                height: 1,
                width: '100%',
                marginTop: 5,
              }}
            />

            <ScrollView
              style={{
                width: '100%',
                backgroundColor: 'yellow',
              }}
            >
              <Text> hola </Text>
              {business.services.map((el, i) => (
                <View key={i}>
                  <Text>{el.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* TITLE NAME AND DESCRIPTION */}
        <View
          style={{
            position: 'absolute',
            alignItems: 'flex-start',
            left: 10,
            paddingTop: 65,
          }}
        >
          <View
            style={{
              height: 'auto',
              width: 'auto',
            }}
          >
            <Text style={{ fontSize: 30, color: 'white' }}>
              {business.name}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 15,
              paddingTop: 5,
              color: 'white',
            }}
          >
            {business.description}
          </Text>
        </View>

        {/* INFO BUTTONS ON THE TOP RIGHT */}
        <View
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
          }}
        >
          <Button
            icon={(
              <Icon
                name="info-outline"
                type="material"
                size={28}
                color="white"
              />
)}
            containerStyle={{}}
            onPress={() => {
              /* TEMPORARY, REPLACE WITH INFORMATION PAGE */
              alert(`${street} ${number}, ${zone}.`);
            }}
            buttonStyle={{ backgroundColor: 'transparent' }}
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

import {
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, { Component } from 'react';
import {
  Divider,
  Button,
  Icon,
  Image,
  Header,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from '../libraries/styles/styles';
import { units } from '../libraries/helpers';
import { platformBackColor } from '../libraries/styles/constants';

type Props = {};

const { vw, vh } = units;

const menuStyles = StyleSheet.create({
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
  },
  name: {
    left: 0,
    paddingTop: 20,
    fontSize: 25,
    color: 'black',
    fontFamily: 'Nunito-SemiBold',
  },
});

class Buscador extends Component<Props> {
  state = {
    isEditing: false,
    text: '',
  };

  componentDidMount() {
    const { user } = this.props;
    this.setState({ text: `${user.name} ${user.lastname}` });
  }

  toggle() {
    const { navigation } = this.props;
    navigation.openDrawer();
  }

  render() {
    const { isEditing, text } = this.state;
    const { navigation, user } = this.props;
    return (
      <View style={styles.container}>
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
        <View style={menuStyles.avatarContainer}>
          <View style={menuStyles.avatar}>
            <Image
              style={menuStyles.avatar}
              source={user.image ? { uri: user.image } : null}
            />
          </View>
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100 * vw,
          }}
          >
            <TextInput
              value={text}
              onChangeText={value => this.setState({ text: value })}
              editable={isEditing}
              style={{
                fontFamily: 'Nunito-SemiBold', fontSize: 20, paddingHorizontal: 5,
              }}
            />
            <Button
              containerStyle={{ }}
              icon={<Icon name="edit" size={25} />}
              type="clear"
              onPress={() => {
                const { isEditing } = this.state;
                this.setState({ isEditing: !isEditing });
              }}
            />
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
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Buscador);

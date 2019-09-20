import { Text, View, Platform } from 'react-native';
import React, { Component } from 'react';
import { Divider, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import styles from '../libraries/styles/styles';
import { BackButton } from '../libraries/props';
import { UserData } from '../libraries/helpers';

type Props = {};

class Recents extends Component<Props> {
  state = {
    contentList: [],
  };

  componentDidMount = () => {
    const { token, uuid, user } = this.props;
    const contentList = [];
    UserData.getRecents(user.uuid).forEach(el => contentList.push(el));
    this.setState({ contentList });
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <BackButton navigation={navigation} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.token,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Recents);

import {
  Text,
  View,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import React, { Component } from 'react';
import { Button, Icon, Header } from 'react-native-elements';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import styles from '../libraries/styles/styles';
import { BackButton } from '../libraries/props';
import { UserData } from '../libraries/helpers';
import SearchBarSlideUp from './searchbar';
import { ADD_BUSINESS_UUID } from '../actions';
import { platformBackColor } from '../libraries/styles/constants';

type Props = {};

class Recents extends Component<Props> {
  state = {
    contentList: [],
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    token: PropTypes.string.isRequired,
    navigateToBusiness: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.searchModal = React.createRef();
  }

  componentDidMount = () => {
    const { user } = this.props;
    const contentList = [];
    UserData.getRecents(user.uuid).forEach(el => contentList.push(el));
    this.setState({ contentList });
  };

  toggle() {
    const { navigation } = this.props;
    navigation.openDrawer();
  }

  toggleSearchBar() {
    const { current } = this.searchModal;
    const { navigation } = this.props;
    const { searchBarIsOpen } = this.state;
    navigation.setParams({
      searchBarIsOpen: !searchBarIsOpen,
    });
    this.setState({ searchBarIsOpen: !searchBarIsOpen });
    current.toggle();
  }

  render() {
    const { navigation, token, navigateToBusiness } = this.props;
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
        <ScrollView style={{ width: '100%', top: 5 }} scrollEnabled>
          <View
            style={{
              justifyContent: 'center',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Button
              icon={<Icon name="search" size={22} color="gray" />}
              // title="¿A dónde querés comprar?"
              onPress={() => {
                this.toggleSearchBar();
              }}
              containerStyle={{ width: '80%' }}
              titleStyle={{ fontSize: 13, left: 10, color: 'grey' }}
              buttonStyle={{
                borderRadius: 15,
                justifyContent: 'flex-start',
                paddingVertical: 10,
                backgroundColor: '#E0E0E0',
                width: '100%',
              }}
            />
            <Button
              onPress={() => {
                alert('In progresss');
              }}
              icon={(
                <Icon
                  name="settings-input-component"
                  size={30}
                  underlayColor="rgba(1,1,1, 0.2)"
                />
)}
              containerStyle={{ overflow: 'hidden', left: 5 }}
              buttonStyle={{
                backgroundColor: 'transparent',
                borderRadius: 50,
              }}
            />
          </View>
        </ScrollView>
        <SearchBarSlideUp
          navigation={navigation}
          token={token}
          ref={this.searchModal}
          navigateToBusiness={navigateToBusiness}
        />
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
  return {
    navigateToBusiness: (uuid) => {
      dispatch({
        type: ADD_BUSINESS_UUID,
        uuid,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Recents);

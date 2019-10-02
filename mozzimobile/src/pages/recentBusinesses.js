import {
  Text,
  View,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  RefreshControl,
  FlatList,
} from 'react-native';
import React, { Component } from 'react';
import {
  Button, Icon, Header, Image,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from '../libraries/styles/styles';
import { BackButton, BusinessButton, SearchButton } from '../libraries/props';
import { UserData, units } from '../libraries/helpers';
import SearchBarSlideUp from './searchbar';
import { ADD_BUSINESS_UUID } from '../actions';
import { platformBackColor } from '../libraries/styles/constants';

type Props = {};

const { vh, vw } = units;

class Recents extends Component<Props> {
  state = {
    contentList: [],
    refreshing: false,
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
    this.onRefresh = this.onRefresh.bind(this);
    this.navToStore = this.navToStore.bind(this);
    this.deleteBusiness = this.deleteBusiness.bind(this);
  }

  componentDidMount = () => {
    this.onRefresh();
  };

  onRefresh() {
    const { user } = this.props;
    this.setState({ refreshing: true });
    const contentList = [];
    UserData.getRecents(user.uuid).forEach(el => contentList.push(el));
    this.setState({ contentList, refreshing: false });
  }

  navToStore = (uuid) => {
    const { navigateToBusiness, navigation } = this.props;
    navigateToBusiness(uuid);
    navigation.navigate('Business');
  };

  deleteBusiness(business) {
    const { user } = this.props;
    UserData.removeUserRecents({ uuid: user.uuid, business });
    this.onRefresh();
  }

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
    const { contentList, refreshing } = this.state;
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
        <ScrollView
          style={{ width: '100%', top: 5 }}
          scrollEnabled
          refreshControl={(
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
)}
        >
          <View
            style={{
              justifyContent: 'center',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <SearchButton
              onPress={() => {
                this.toggleSearchBar();
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
          <Text
            style={{
              fontFamily: 'Nunito-SemiBold',
              fontSize: 25,
              color: 'black',
              marginTop: 25,
              left: 12,
            }}
          >
            {' '}
            Recientes
            {' '}
          </Text>
          <View style={{ flex: 1, alignItems: 'center' }}>
            {
              (contentList.length === 0) ? (
                <View style={{
                  flex: 1, height: 80 * vh, justifyContent: 'center', alignItems: 'center', paddingBottom: 150,
                }}
                >
                  <Image
                    style={{ width: 30 * vw, height: 30 * vw }}
                    source={require('../assets/images/noRecents.png')}
                  />
                  <Text style={{
                    fontFamily: 'Nunito-SemiBold', fontSize: 22, color: 'black', textAlign: 'center',
                  }}
                  >
                    No tienes negocios recientes todavía
                  </Text>
                  <Text style={{ fontFamily: 'Nunito-SemiBold' }}>
              Empeza a buscar!
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={contentList}
                  keyExtractor={item => item.uuid}
                  renderItem={({ item }) => (
                    <BusinessButton
                      item={item}
                      navigation={navigation}
                      onPress={() => {
                        this.navToStore(item.uuid);
                      }}
                      deleteBusiness={this.deleteBusiness}
                    />
                  )}
                />
              )
            }
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

/*

    category: (...)
description: (...)
name: (...)
number: (...)
street: (...)
uuid: (...)
zone: (...)

    */

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

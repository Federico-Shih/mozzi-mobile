import {
  Text,
  View,
  Platform,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import React, { Component } from 'react';
import {
  SearchBar,
  Button,
  Icon,
  Divider,
  Header,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from '../libraries/styles/styles';
import { BackButton, SearchButton, BusinessButton } from '../libraries/props';
import { platformBackColor } from '../libraries/styles/constants';
import {
  sendPopup,
  errorMessages,
  units,
  UserData,
} from '../libraries/helpers';
import SearchBarSlideUp from './searchbar';

type Props = {};

const MyButton = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback,
});

class Favorites extends Component<Props> {
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
  }

  componentDidMount = () => {
    this.onRefresh();
  };

  onRefresh() {
    const { user } = this.props;
    this.setState({ refreshing: true });
    const contentList = [];
    UserData.getFavorites(user.uuid).forEach(el => contentList.push(el));
    this.setState({ contentList, refreshing: false });
  }

  navToStore = (uuid) => {
    const { navigateToBusiness, navigation } = this.props;
    navigateToBusiness(uuid);
    navigation.navigate('Business');
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
            Favoritos
            {' '}
          </Text>
          <View style={{ flex: 1, alignItems: 'center' }}>
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
                />
              )}
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
)(Favorites);

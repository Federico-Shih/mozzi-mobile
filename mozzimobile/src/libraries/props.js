import {
  View,
  Text,
  Animated,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import { Button, Icon, Image } from 'react-native-elements';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';

import { units } from './helpers';
import styles from './styles/styles';
import buttonStyles from './styles/button-styles';
import { REMOVE_TOKEN, REMOVE_USER } from '../actions';

type Props = {};

const {
  vh, vw, vmax, vmin,
} = units;

// Modify the time to display the animation POPUP in ms
const popupDuration = 200;

// Popup component
export class Popup extends Component<Props> {
  static propTypes = {
    init: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = {
      anim: new Animated.Value(-50),
    };
  }

  componentDidMount() {
    const { init } = this.props;
    const { anim } = this.state;
    if (init) {
      Animated.timing(anim, {
        toValue: 20,
        duration: popupDuration,
      }).start();
    }
  }

  componentDidUpdate(prevProps) {
    const { init } = this.props;
    const { anim } = this.state;
    if (init !== prevProps.init) {
      if (init) {
        Animated.timing(anim, {
          toValue: 20,
          duration: popupDuration,
        }).start();
      } else {
        Animated.timing(anim, {
          toValue: -50,
          duration: popupDuration,
        }).start();
      }
    }
  }

  render() {
    const { anim } = this.state;
    const { message } = this.props;
    return (
      <Animated.View
        style={{ ...styles.popup, bottom: anim, position: 'absolute' }}
      >
        <View style={{ height: '100%', backgroundColor: 'red', width: 10 }} />
        <Text style={{ paddingLeft: 20, fontSize: 15 }}>{message}</Text>
      </Animated.View>
    );
  }
}

const BackButtonProp = ({ navigation }) => (
  <Button
    icon={(
      <Icon
        name={Platform.select({
          ios: 'arrow-back-ios',
          android: 'arrow-back',
        })}
        size={30}
        color="gray"
      />
)}
    onPress={() => {
      navigation.goBack();
    }}
    containerStyle={buttonStyles.backButtonCont}
    buttonStyle={buttonStyles.backButton}
  />
);

const buttons = [
  {
    title: 'Inicio',
    nav: 'Home',
    id: 'home',
    icon: 'home',
  },
  {
    title: 'Tus Turnos',
    nav: 'Turns',
    id: 'turns',
    icon: 'event',
  },
  {
    title: 'Mi Perfil',
    nav: 'Profile',
    id: 'profile',
    icon: 'person',
  },
  {
    title: 'Recientes',
    nav: 'Recent',
    id: 'recent',
    icon: 'restore',
  },
  {
    title: 'Favoritos',
    nav: 'Favs',
    id: 'favs',
    icon: 'star',
  },
  {
    title: 'Configuración',
    nav: 'Config',
    id: 'config',
    icon: 'settings',
  },
];

const menuStyles = StyleSheet.create({
  menu: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    padding: 0,
    paddingLeft: 0,
  },
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
  item: {
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'Nunito-SemiBold',
    paddingTop: 0,
    margin: 0,
    color: 'black',
    textAlign: 'left',
    paddingLeft: 10,
  },
  itemContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    margin: 0,
    padding: 0,
    paddingTop: 0,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    overflow: 'hidden',
  },
  itemButton: {
    justifyContent: 'flex-start',
    margin: 0,
    paddingVertical: 10,
    paddingLeft: 15,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderWidth: 0,
  },
});

function SideMenuButtons(props) {
  const listButtons = props.buttons.map(btn => (
    <Button
      title={btn.title}
      key={btn.id}
      type="clear"
      containerStyle={menuStyles.itemContainer}
      titleStyle={menuStyles.item}
      onPress={() => {
        props.navigation.navigate(btn.nav);
      }}
      buttonStyle={menuStyles.itemButton}
      icon={<Icon name={btn.icon} color="#5819E0" size={25} />}
    />
  ));
  return listButtons;
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
    removeToken: () => {
      dispatch({
        type: REMOVE_TOKEN,
      });
    },
    removeUser: () => {
      dispatch({
        type: REMOVE_USER,
      });
    },
  };
}

const MenuProp = (props) => {
  const {
    user, navigation, removeToken, removeUser,
  } = props;
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <SafeAreaView
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          forceInset={{ top: 'always', horizontal: 'never' }}
        >
          <View style={menuStyles.avatarContainer}>
            <View style={menuStyles.avatar}>
              <Image
                style={menuStyles.avatar}
                source={user.image ? { uri: user.image } : null}
              />
            </View>
            <Text style={menuStyles.name}>
              {`${user.name} ${user.lastname}`}
            </Text>
          </View>

          <SideMenuButtons buttons={buttons} navigation={navigation} />
        </SafeAreaView>
      </ScrollView>
      <Button
        containerStyle={{ width: '100%' }}
        icon={<Icon name="exit-to-app" color="#5819E0" size={25} />}
        titleStyle={{
          color: 'black',
          fontFamily: 'Nunito-SemiBold',
          left: 10,
          fontSize: 20,
        }}
        buttonStyle={{
          justifyContent: 'center',
          paddingRight: 20,
          paddingVertical: 10,
        }}
        type="clear"
        onPress={() => {
          removeToken();
          removeUser();
          navigation.replace('Auth');
        }}
        title="Cerrar Sesión"
      />
    </View>
  );
};

export const BackButton = BackButtonProp;
export const Menu = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuProp);

const PressedElement = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback,
});

export const SearchButton = ({ onPress }) => (
  <Button
    icon={<Icon name="search" size={22} color="gray" />}
    // title="¿A dónde querés comprar?"
    onPress={onPress}
    containerStyle={{ width: 80 * vw }}
    titleStyle={{ fontSize: 13, left: 10, color: 'grey' }}
    buttonStyle={{
      borderRadius: 15,
      justifyContent: 'flex-start',
      paddingVertical: 10,
      backgroundColor: '#E0E0E0',
      width: '100%',
    }}
  />
);

const RemoveIcon = (
  <Icon
    name="delete"
    type="material"
    color="black"
    size={35}
    containerStyle={{ flex: 1, justifyContent: 'center' }}
  />
);

export const BusinessButton = ({
  item, navigation, onPress, deleteBusiness,
}) => {
  const {
    name, category, description, street, number, zone, uuid,
  } = item;
  return (
    <Swipeout
      right={[{
        text: '', onPress: () => { deleteBusiness(item); }, type: 'delete', component: RemoveIcon,
      }]}
      backgroundColor="#FFF"
    >
      <PressedElement onPress={onPress}>
        <View
          style={{
            height: 16 * vh,
            width: 100 * vw,
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            source={{ uri: 'https://semantic-ui.com/images/wireframe/image.png' }}
            style={{ width: 14 * vh, height: 14 * vh }}
          />
          <View
            style={{
              marginVertical: 1 * vh,
              marginLeft: 14,
            }}
          >
            <Text
              style={{
                fontFamily: 'Nunito-SemiBold',
                fontSize: 22,
                color: 'black',
              }}
            >
              {name}
            </Text>
            <Text style={{ height: 2 * vh, fontSize: 18, color: 'black' }}>
              {category}
            </Text>
            <Text style={{ width: 60 * vw, fontSize: 13, color: '#5F5F5F' }}>
              {description}
            </Text>
            <Text style={{ fontSize: 16, color: 'black', marginTop: 3 }}>
              {`${street} ${number}, ${zone}`}
            </Text>
            <View style={{ flex: 1 }} />
          </View>
        </View>
      </PressedElement>
    </Swipeout>
  );
};

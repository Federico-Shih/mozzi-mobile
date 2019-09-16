import {
  View, Text, Animated, Platform,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './styles/styles';
import buttonStyles from './styles/buttonsStyles';

type Props = {};

// Not used
const TitleProp = (props) => {
  const { text } = props;
  return <Text style={styles.title}>{text}</Text>;
};

TitleProp.propTypes = {
  text: PropTypes.string.isRequired,
};

// Not used
const LogRegTitleProp = (props) => {
  const { style, text } = props;
  return (
    <View style={{ alignSelf: 'flex-start' }}>
      <Text style={style}>{text}</Text>
    </View>
  );
};

LogRegTitleProp.propTypes = {
  text: PropTypes.string.isRequired,
};

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

export const BackButton = BackButtonProp;
export const Title = TitleProp;
export const StyledTitle = LogRegTitleProp;

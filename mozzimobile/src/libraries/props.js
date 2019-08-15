import { View, Text, Animated } from 'react-native';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './styles/styles';

type Props = {};

const TitleProp = (props) => {
  const { text } = props;
  return <Text style={styles.title}>{text}</Text>;
};

TitleProp.propTypes = {
  text: PropTypes.string.isRequired,
};

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

const popupDuration = 200;

/* To implement Popup */
/*
    popupMessage = {title: '', message: '', previousMessage: ''};

    displayPopup = () => {
        if (this.popupMessage.message) {
            return <Popup message={this.popupMessage.message} init/>
        } else if(!this.popupMessage.message && this.popupMessage.previousMessage) {
            return <Popup message={this.popupMessage.previousMessage} init = {false}/>
        } else {
            return null;
        }
    };

    resetErrorPopup = () => {
        if (this.popupMessage.message != ''){
            this.popupMessage = {...this.popupMessage, title: '', message: ''};
            this.forceUpdate();
        }
        if (this.time) {
            clearTimeout(this.time);
        }
    };

    time = '';

    sendPopup = (title, message) => {
        this.popupMessage = {title: title, message: message, previousMessage: message};
        this.forceUpdate();
        this.time = setTimeout(this.resetErrorPopup, 2000);
    };

    ADD A <View>
        {this.displayPopup()}
    </View>

    in render
*/

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

export const Title = TitleProp;
export const StyledTitle = LogRegTitleProp;

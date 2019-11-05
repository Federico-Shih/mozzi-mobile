import { StyleSheet } from 'react-native';
import { fontType, platformBackColor } from './constants';
import { units } from '../helpers';

const { vw, vh } = units;

export default StyleSheet.create({
  reglogButtonText: {
    fontSize: 20,
    fontFamily: fontType,
    color: '#FFFFFF',
  },

  reglogButton: {
    paddingVertical: 12,
    backgroundColor: '#5819E0',
    height: vh * 7,
  },
  backButtonCont: {
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 50,
  },
  backButton: {
    borderRadius: 50,
    backgroundColor: platformBackColor,
    marginLeft: 5,
    marginTop: 5,
  },
});

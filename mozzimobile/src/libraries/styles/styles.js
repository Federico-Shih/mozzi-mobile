import { StyleSheet, Dimensions } from 'react-native';
import { fontType, platformBackColor } from './constants';
import { units } from '../helpers';

const {
  vh, vw, vmax, vmin,
} = units;

const InputTextWidth = `${Math.round(
  (1 - 40 / Dimensions.get('window').width) * 100,
).toString()}%`;

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: platformBackColor,
  },

  avoidContainer: {
    backgroundColor: platformBackColor,
    flex: 1,
    justifyContent: 'flex-end',
  },

  title: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 36,
    fontFamily: fontType,
    borderBottomWidth: 2,
    marginTop: 40,
    padding: 8,
  },
  smallLogInText: {
    fontSize: 15,
    fontFamily: fontType,
    fontWeight: '100',
    letterSpacing: 0,
  },
  forgotPassword: {
    fontSize: 15,
    fontFamily: fontType,
    letterSpacing: 0,
    color: 'rgba(70, 0, 218, 0.7)',
  },
  logregTitle: {
    textAlign: 'left',
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 35,
    marginTop: 75,
    marginLeft: 30,
    top: '5%',
    fontFamily: fontType,
  },
  inputText: {
    borderWidth: 0,
    borderColor: '#AAAAAA',
    width: '100%',
    alignSelf: 'center',
    height: 5 * vh,
  },
  popup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    position: 'absolute',
    marginHorizontal: 50,
    height: 50,
    width: Dimensions.get('window').width - 100,
    backgroundColor: platformBackColor,
  },
  dateStyle: {
    backgroundColor: '#9868FF',
    marginHorizontal: 7,
    marginVertical: 15,
    width: 80,
    height: '80%',
    borderRadius: 20,
  },
  dateStyleSelected: {
    backgroundColor: '#6A32E3',
    marginHorizontal: 7,
    marginVertical: 15,
    width: 80,
    height: '80%',
    borderRadius: 20,
    elevation: 10,
  },
  timeSelectorButton: {
    top: -40,
    backgroundColor: 'black',
  },
  timeFrameSelected: {
    backgroundColor: 'rgba(200,0,0, .2)',
  },
  timeFrameOccupied: {
    backgroundColor: 'rgba(88, 25, 224, 0.3)',
  },
  timeFrame: {
    backgroundColor: 'rgba(0,0,0, .05)',
    width: '100%',
    marginLeft: 10,
  },
});

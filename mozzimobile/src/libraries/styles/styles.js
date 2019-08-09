import { StyleSheet, Dimensions } from 'react-native';
import { fontType, platformBackColor } from './constants';

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
    borderBottomWidth: 2,
    borderWidth: 2,
    borderRadius: 30,
    borderColor: 'black',
    marginTop: 7,
    width: InputTextWidth,
    alignSelf: 'center',
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
    backgroundColor: '#E4EBEE',
    marginHorizontal: 7,
    marginVertical: 15,
    width: 80,
    borderRadius: 20,
  },
  dateStyleSelected: {
    backgroundColor: '#E4EBEE',
    marginHorizontal: 7,
    marginVertical: 15,
    width: 80,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: 'purple',
  },
  timeSelectorButton: {
    top: -40,
    backgroundColor: 'black',
  },
});

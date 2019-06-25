import {Platform, StyleSheet} from 'react-native';

let platformFont;
switch (Platform.OS)
{
  case 'ios':
    platformFont = "San Francisco";
    break;
  case 'android':
    platformFont = "Montserrat";
}

export default StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    avoidContainer: {
      backgroundColor: '#F5FCFF',
      flex: 1,
      justifyContent: 'flex-end',
    },
    title: {
      textAlign: 'center',
      color: "#000000",
      fontSize: 36,
      fontFamily: platformFont,
      borderBottomWidth: 2,
      marginTop: 40, 
      padding: 8,
    },
    smallLogInText: {
      fontSize: 15,
      fontFamily: platformFont,
      fontWeight: '100',
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
      fontFamily: platformFont
    },

    inputText: {
        borderBottomWidth: 2, 
        borderWidth: 2, 
        borderRadius: 30, 
        borderColor: 'black', 
        marginTop: 7
    },

  });
  
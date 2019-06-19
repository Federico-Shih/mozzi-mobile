import {Platform, StyleSheet} from 'react-native';

let platformFont;
switch (Platform.OS)
{
  case 'ios':
    platformFont = "San Francisco";
    break;
  case 'android':
    platformFont = "monospace";
}

export default StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
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
    textTest: {
      textAlign: 'center',
      fontSize: 40,
      top: '5%',
      fontFamily: platformFont
    },
    backButton: {
      textAlign: 'left',
      fontSize: 30,
      fontFamily: platformFont,
    }
  });
  
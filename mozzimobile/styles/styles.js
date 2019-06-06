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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    title: {
      textAlign: 'center',
      color: "#000000",
      fontSize: 36,
      fontFamily: platformFont,
      borderWidth: 2,
      margin: 2, 
      padding: 8,
      bottom: 70,
    }
  });
  
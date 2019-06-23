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

    reglogButtonText: {
        fontSize: 25,
        fontFamily: platformFont
    },
    
    reglogButton: {
        padding: 12,
    }

  });
  
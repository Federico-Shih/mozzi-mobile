import {Platform} from 'react-native';

let platformFont;
switch (Platform.OS)
{
  case 'ios':
    platformFont = "San Francisco";
    break;
  case 'android':
    platformFont = "Montserrat";
}

export const fontType = platformFont;
export const platformBackColor = '#F5FCFF';

import { Platform } from 'react-native';

let platformFont;
switch (Platform.OS) {
  case 'ios':
    platformFont = 'Nunito-SemiBold';
    break;
  case 'android':
    platformFont = 'Nunito-SemiBold';
    break;
  default:
    platformFont = 'Nunito-Semibold';
    break;
}

export const fontType = platformFont;
export const platformBackColor = '#FFFFFF';

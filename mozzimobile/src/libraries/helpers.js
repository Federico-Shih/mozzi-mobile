import { PermissionsAndroid, Platform } from 'react-native';

// Validate that email is of the correct format
export const validateEmail = function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

// Concentrates all messages so you can modify this to change language
export const errorMessages = {
  name: {
    empty: 'No haz ingresado un nombre.',
    spaces: 'Tu nombre contiene espacios.',
  },
  surname: {
    empty: 'No haz ingresado un apellido.',
    spaces: 'Tu apellido contiene espacios.',
  },
  email: 'El e-mail no es válido.',
  password: 'La contraseña es menor a 8 carácteres.',
  confirmpassword: {
    nomatch: 'Las contraseñas no coinciden.',
    empty: 'No haz ingresado la confirmación de tu contraseña.',
  },
  duplicateAccount: 'Esta cuenta ya fue creada',
  internalServerError: 'Hubo un problema del servidor',
  certificateError: 'Hubo problema con tu WIFI, prueba con otra conexión.',
  noConnection: 'No tienes conexión de Internet. ',
  wrongPassword: 'La contraseña ingresada es incorrecta.',
  noDateSelected: 'No haz seleccionado una fecha',
  noTimeSelected: 'No haz seleccionado un horario',
};

// Grants permissions on android and iOS
export const grantingPermissions = Platform.select({
  ios: () => {},
  android: () => new Promise((resolve) => {
    try {
      PermissionsAndroid.requestMultiple(
        // modificar permisos aca
        [
          PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
          PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
        ],
      ).then((result) => {
        if (
          result['android.permission.READ_CALENDAR']
            && result['android.permission.WRITE_CALENDAR'] === 'granted'
        ) {
          resolve('Thank you very much!');
        } else if (
          result['android.permission.READ_CALENDAR']
            || result['android.permission.WRITE_CALENDAR'] === 'never_ask_again'
        ) {
          resolve(
            'Please Go into Settings -> Applications -> Mozzi -> Permissions and Allow permissions to continue',
          );
        }
      });
    } catch (err) {
      resolve(err);
    }
  }),
});

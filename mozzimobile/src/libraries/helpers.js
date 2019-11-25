import { PermissionsAndroid, Platform, Dimensions } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import RNCalendarEvents from 'react-native-calendar-events';
import one from '../assets/1.jpg';
import two from '../assets/2.jpg';
import three from '../assets/3.jpg';
import four from '../assets/4.jpg';
import five from '../assets/5.jpg';
import six from '../assets/6.jpg';
import seven from '../assets/7.jpg';
import eight from '../assets/8.jpg';
import nine from '../assets/9.jpg';
import ten from '../assets/10.jpg';

const Realm = require('realm');

const images = [one, two, three, four, five, six, seven, eight, nine, ten];

// Validate that email is of the correct format
export const validateEmail = function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

function hashText(text) {
  let hashValue = 0;
  for (let i = 0; i < text.length; i += 1) {
    hashValue += text.charCodeAt(i);
  }
  hashValue = hashValue.toString();
  return parseInt((hashValue[hashValue.length - 1]), 10);
}

export const randomImage = text => images[hashText(text)];

const temp = {
  vw: Dimensions.get('window').width / 100,
  vh: Dimensions.get('window').height / 100,
};

temp.vmin = Math.min(temp.vw, temp.vh);
temp.vmax = Math.max(temp.vw, temp.vh);

temp.update = () => {
  const { width, height } = Dimensions.get('window');
  temp.vw = width / 100;
  temp.vh = height / 100;
  temp.vmax = Math.max(width, height);
  temp.vmin = Math.min(width, height);
};

export const units = temp;

export const getUsableTimeFormat = val => new Date(val)
  .toLocaleTimeString('en-US', {
    timeStyle: 'medium',
    hour12: false,
    timeZone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
  })
  .slice(0, -3);

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
    empty: 'No haz confirmado tu contraseña.',
  },
  duplicateAccount: 'Esta cuenta ya fue creada',
  internalServerError: 'Hubo un problema del servidor',
  certificateError: 'Hubo problema con tu WIFI, prueba con otra conexión.',
  noConnection: 'No tienes conexión de Internet. ',
  wrongPassword: 'La contraseña ingresada es incorrecta.',
  noDateSelected: 'No haz seleccionado una fecha',
  noTimeSelected: 'No haz seleccionado un horario',
  notEnoughLength: 'Tiene que ingresar más de 1 letra',
  tooMuchLength: 'Tiene que ingresar menos de 25 letras',
};

export const newTime = (hours, minutes) => {
  // Defaults as 0 time and adds the hours and minutes so we can manipulate time from 0

  const nah = new Date(0).setTime(
    1000 * 60 * minutes + 1000 * 60 * 60 * (hours + 3),
  );

  // Returns formats the date object so it returns the hour and minute only
  return new Date(nah)
    .toLocaleTimeString('en-US', {
      timeStyle: 'medium',
      hour12: false,
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: 'numeric',
      minute: 'numeric',
    })
    .slice(0, -3);
};

export const sendPopup = (message) => {
  EventRegister.emit('ReceiveMessage', message);
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

export const Calendar = {
  saveEvent: async ({
    name, street, number, zone,
  }, { startDate, endDate }) => {
    const res = await RNCalendarEvents.saveEvent(`Turno en ${name}`, {
      startDate,
      endDate,
      allDay: true,
      description: `Tenes un turno en ${name} a las ${new Date(startDate)} hs en ${street} ${number}, ${zone}`,
      location: `${street} ${number}, ${zone}`,
    }).catch((_) => {
      sendPopup('Calendar error');
    });

    const initial = new Date(2019, 9, 1);
    const end = new Date(2020, 1, 1);

    // const events = await RNCalendarEvents.fetchAllEvents(initial.toISOString(), end.toISOString());
    const events = await RNCalendarEvents.findEventById(res);
  },
};

const UserSchema = {
  name: 'User',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    favorites: 'Business[]',
    recents: 'Business[]',
  },
};

const BusinessSchema = {
  name: 'Business',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    name: 'string',
    description: 'string',
    street: 'string',
    number: 'int',
    zone: 'string',
    category: 'string',
  },
};

export function alphabetize(array, compareKey = 'name') {
  const res = {};
  array.forEach((el) => {
    const letter = el[compareKey];
    const key = letter[0].toUpperCase();
    if (!(key in res)) res[key] = [];
    res[key].push(el);
  });
  const keys = Object.keys(res);
  keys.forEach((key) => {
    res[key].sort((a, b) => a[compareKey] - b[compareKey]);
  });

  return res;
}

export const UserData = {
  loadRealm: () => new Promise((resolve) => {
    try {
      this.realm = new Realm({ schema: [UserSchema, BusinessSchema] });
    } catch (e) {
      sendPopup(e.message);
    }
  }),
  realm: {},
  createUser: (uuid) => {
    try {
      this.realm.write(() => {
        const hi = this.realm.create('User', {
          uuid,
          favorites: [],
          recents: [],
        });
        console.log(hi);
      });
    } catch (e) {
      console.log(e);
    }
  },
  checkUser: (uuid) => {
    const user = this.realm.objects('User').find((item) => {
      if (item.uuid === uuid) {
        return true;
      }
      return false;
    });
    return user !== undefined;
  },
  updateUserFavorites: ({ uuid, business }) => {
    const user = this.realm.objects('User').find((item) => {
      if (item.uuid === uuid) {
        return true;
      }
      return false;
    });
    this.realm.write(() => {
      const { favorites } = user;

      // Probable efficiency leak
      const newFavorites = favorites.filter(val => val.uuid !== business.uuid);
      newFavorites.unshift(business);
      this.realm.create(
        'User',
        {
          uuid,
          favorites: newFavorites,
          recents: user.recents,
        },
        true,
      );
    });
  },
  updateUserRecents: ({ uuid, business }) => {
    const user = this.realm.objects('User').find((item) => {
      if (item.uuid === uuid) {
        return true;
      }
      return false;
    });
    this.realm.write(() => {
      const { recents } = user;
      // Probable efficiency leak
      const newRecents = recents.filter(val => val.uuid !== business.uuid);
      newRecents.unshift(business);
      this.realm.create(
        'User',
        {
          uuid,
          favorites: user.favorites,
          recents: newRecents,
        },
        true,
      );
    });
  },
  removeUserRecents: ({ uuid, business }) => {
    const user = this.realm.objects('User').find((item) => {
      if (item.uuid === uuid) {
        return true;
      }
      return false;
    });

    this.realm.write(() => {
      const { recents } = user;
      // Probable efficiency leak
      const newRecents = recents.filter(val => val.uuid !== business.uuid);
      console.log(newRecents);
      this.realm.create(
        'User',
        {
          uuid,
          favorites: user.favorites,
          recents: newRecents,
        },
        true,
      );
    });
  },
  removeUserFavorites: ({ uuid, business }) => {
    const user = this.realm.objects('User').find((item) => {
      if (item.uuid === uuid) {
        return true;
      }
      return false;
    });
    this.realm.write(() => {
      const { favorites } = user;
      // Probable efficiency leak
      const newFavorites = favorites.filter(val => val.uuid !== business.uuid);
      this.realm.create(
        'User',
        {
          uuid,
          favorites: newFavorites,
          recents: user.recents,
        },
        true,
      );
    });
  },
  getFavorites: (uuid) => {
    const user = this.realm.objects('User').find((item) => {
      if (item.uuid === uuid) {
        return true;
      }
      return false;
    });
    return user.favorites;
  },
  getRecents: (uuid) => {
    const user = this.realm.objects('User').find((item) => {
      if (item.uuid === uuid) {
        return true;
      }
      return false;
    });
    return user.recents;
  },
};

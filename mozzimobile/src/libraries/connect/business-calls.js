import { newTime, sendPopup } from '../helpers';

const axios = require('axios');
const newUUID = require('uuid');

const serverSettings = require('./server');

// Search data that will be received.
const res = [
  {
    name: 'BuenDia',
    description: 'Lolazo',
    image: 'https://semantic-ui.com/images/wireframe/image.png',
    uuid: 'hola',
  },
  {
    name: 'BuenDia',
    description: 'Lolazo',
    image: 'https://semantic-ui.com/images/wireframe/image.png',
    uuid: 'hola',
  },
  {
    name: 'BuenDia',
    description: 'Lolazo',
    image: 'https://semantic-ui.com/images/wireframe/image.png',
    uuid: 'hola',
  },
];

// Business data that will be received when a business is selected
const business = {
  name: 'Bananeros',
  street: 'Nuñez',
  number: 2757,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur aliquam, ante ac accumsan tristique, justo dui consectetur tortor, ac molestie justo nulla eget magna. Proin eget quam nec enim convallis faucibus placerat eu lorem. Maecenas in nunc ultrices, blandit ligula vitae, molestie magna. Curabitur ac tempus nulla. Duis vitae sodales tortor. Maecenas lacus sapien, maximus nec ligula nec, hendrerit dignissim odio. Praesent rhoncus facilisis diam, posuere pulvinar orci fringilla in. Nunc sit amet luctus quam. Duis vehicula ante porta porttitor gravida. Curabitur sed augue quam. Etiam quis quam sed tortor facilisis luctus. Donec aliquam mauris rhoncus mi lobortis sollicitudin. Ut ut auctor nisi, eget sodales elit. Integer bibendum dolor vestibulum, volutpat lacus a, faucibus augue. Ut nec congue mi, sit amet pellentesque orci. Sed at nisl ut arcu dictum aliquam ut non nibh.',
  zone: 'CABA',
  // Services that can be selected from business
  services: [
    {
      name: 'hola',
      id: 'ELELE',
      description: 'Buen dia senor',
      precio: 100,
    },
    {
      name: 'chau',
      id: 'mmm',
      description: 'Buen dia senor',
      precio: 200,
    },
    {
      name: 'cebo poneme un 10',
      id: 'ELELE',
      description: 'Buen dia senor',
      precio: 100,
    },
  ],
  image: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
};

const collections = {
  name: 'lol',
  businesses: [],
  id: 'huh',
};

export const getCollections = ({ token }) => {
  const arr = [];
  for (let i = 0; i < 8; i += 1) {
    arr.push({ ...collections, uuid: newUUID() });
  }
  return arr;
};

export const getStores = ({ search, token }) => axios.post(
  `${serverSettings.serverURL}/graphql`,
  {
    query: `
        query Business($search: String!) {
          businessSearch(name: $search) {
            uuid
            name
            description
          }
        }
      `,
    variables: {
      search,
    },
  },
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  },
);

// To replace when business information is present, receives data that will be used to fill the business template
export const getBusiness = ({ uuid, token }) => axios.post(
  `${serverSettings.serverURL}/graphql`,
  {
    query: `
        query Store($store: ID!) {
          business(uuid: $store) {
            name
            street
            number
            zone
            description
            services {
              uuid
              name
              price
              duration
            }
            postal
          }
        }
      `,
    variables: {
      store: uuid,
    },
  },
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  },
);

// export const getTimetable = ({ uuid, token, serviceId, day}) =>
/*
({ uuid, token }) => new Promise((resolve, reject) => {
  resolve(business);
});
*/

export const addFavorite = ({ businessId, token }) => new Promise(async (resolve) => {
  const response = await axios.post(
    `${serverSettings.serverURL}/graphql`,
    {
      query: `
            mutation AddFavorite($business: ID!) {
              favoriteAdd(business: $business) {
                uuid
              }
            }
        `,
      variables: {
        business: businessId,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    },
  );
  resolve(response);
});

export const removeFavorite = async ({ businessId, token}) => {
  const response = await axios.post(
    `${serverSettings.serverURL}/graphql`,
    {
      query: `
            mutation RemoveFavorite($business: ID!) {
              favoriteDelete(business: $business) {
                uuid
              }
            }
        `,
      variables: {
        business: businessId,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    },
  );
  resolve(response);
}

// To replace when booking appointment info is present
export const sendAppointment = ({ slot, token }) => new Promise(async (resolve, reject) => {
  const lol = await axios.post(
    `${serverSettings.serverURL}/graphql`,
    {
      query: `
            mutation CreateAppointment($slot: ID!) {
              appointmentCreate(slot: $slot) {
                uuid
              }
            }
        `,
      variables: {
        slot,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    },
  );
  resolve(lol);
});

export const getServiceTimes = ({ service, token, day }) => new Promise(async (resolve, reject) => {
  const selectedDay = Math.floor(
    (day.date.getTime() - new Date().getTimezoneOffset() * 60 * 1000)
        / 8.64e7,
  );
  const response = await axios.post(
    `${serverSettings.serverURL}/graphql`,
    {
      query: `
            query Slots($inputSlots: viewSlotsInput) {
              viewSlots(input: $inputSlots) {
                start
                finish
                uuid
                day
                available
                schedule {
                  uuid
                  day
                  start
                  finish
                }
              }
            }
        `,
      variables: {
        inputSlots: {
          day: selectedDay,
          service,
        },
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    },
  );

  if ('errors' in response) {
    resolve(response);
  }

  const { data } = response.data;
  if (data.viewSlots === null) {
    resolve(new Map());
  } else {
    // ADDING SLOTS
    const newMap = new Map();
    const { viewSlots } = data;
    let prevSchedule = '';
    for (let i = 0; i < viewSlots.length; i += 1) {
      const {
        start, schedule, available, uuid,
      } = viewSlots[i];
      if (schedule.uuid !== prevSchedule) {
        newMap.set(newMap.size, {
          start: schedule.start,
          end: schedule.finish,
        });
        prevSchedule = schedule.uuid;
      }

      let isLast = false;
      if (i === viewSlots.length - 1) isLast = true;
      try {
        if (schedule.uuid !== viewSlots[i + 1].schedule.uuid) {
          isLast = true;
        }
      } catch (error) {}
      newMap.set(newMap.size, {
        time: newTime(0, start),
        occupied: !available,
        selected: false,
        key: uuid,
        index: newMap.size,
        isLast,
      });
    }
    resolve(newMap);
  }

  /*
available: true
day: 18136
finish: 1060
schedule:
day: 3
finish: 1090
start: 1000
uuid: "8b896b1d-cd8f-4b87-a123-f2b9c13ec99e"
__proto__: Object
start: 1030
uuid: "cbe3f562-d189-44ed-aad5-20984109dbd9"
  */

  /*
  const start = 8; // What time starts the service
  const end = 20; // What hour it ends
  const interval = 60; // Interval between each service
  const intervals = (end - start) * (60 / interval); // Amount of intervals in the day
  const returnVal = new Map(); // Element mapped to an index so you can find it directly

  // Fills the map with the intervals
  for (let i = 0; i <= intervals; i += 1) {
    const key = newUuid();
    returnVal.set(i, {
      time: newTime(start, i * interval),
      occupied: false,
      selected: false,
      key,
      index: i,
      isLast: i === intervals,
    });
  }
  resolve(returnVal);
  */
});

/*


*/

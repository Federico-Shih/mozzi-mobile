import newUuid from 'uuid';

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

// Function that returns a time object without dates and objective.
const newTime = (hours, minutes) => {
  // Defaults as 0 time and adds the hours and minutes so we can manipulate time from 0
  const nah = new Date(0).setTime(
    1000 * 60 * minutes + 1000 * 60 * 60 * (hours + 3),
  );

  // Returns formats the date object so it returns the hour and minute only
  return new Date(nah)
    .toLocaleTimeString('en-US', {
      timeStyle: 'medium',
      hour12: false,
      timeZone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
    })
    .slice(0, -3);
};

// To replace when Store search API is present
export const getStores = ({ search, token }) => res;

// To replace when business information is present, receives data that will be used to fill the business template
export const getBusiness = ({ uuid, token }) => business;

// export const getTimetable = ({ uuid, token, serviceId, day}) =>
/*
({ uuid, token }) => new Promise((resolve, reject) => {
  resolve(business);
});
*/

// To replace when booking appointment info is present
export const sendAppointment = ({
  uuid, token, service, date, time,
}) => new Promise((resolve, reject) => {
  resolve(true);
});

// To replace when service times and availability is present
export const getServiceTimes = ({
  service, token, uuid, day,
}) => {
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
  return returnVal;
};

/*


*/

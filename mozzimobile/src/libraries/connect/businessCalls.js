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

const business = {
  name: 'Bananeros',
  street: 'Nuñez',
  number: 2757,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur aliquam, ante ac accumsan tristique, justo dui consectetur tortor, ac molestie justo nulla eget magna. Proin eget quam nec enim convallis faucibus placerat eu lorem. Maecenas in nunc ultrices, blandit ligula vitae, molestie magna. Curabitur ac tempus nulla. Duis vitae sodales tortor. Maecenas lacus sapien, maximus nec ligula nec, hendrerit dignissim odio. Praesent rhoncus facilisis diam, posuere pulvinar orci fringilla in. Nunc sit amet luctus quam. Duis vehicula ante porta porttitor gravida. Curabitur sed augue quam. Etiam quis quam sed tortor facilisis luctus. Donec aliquam mauris rhoncus mi lobortis sollicitudin. Ut ut auctor nisi, eget sodales elit. Integer bibendum dolor vestibulum, volutpat lacus a, faucibus augue. Ut nec congue mi, sit amet pellentesque orci. Sed at nisl ut arcu dictum aliquam ut non nibh.',
  zone: 'CABA',
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

const newTime = (hours, minutes) => {
  const nah = new Date(0).setTime(1000 * 60 * minutes + 1000 * 60 * 60 * hours);
  return new Date(nah).toLocaleTimeString('en-US', {
    dateStyle: 'short',
    hour12: false,
    timeZone: 'Etc/GMT',
    hour: 'numeric',
    minute: 'numeric',
  });
};

export const getStores = ({ search, token }) => res;
export const getSomething = () => {};
export const getBusiness = ({ uuid, token }) => business;
// export const getTimetable = ({ uuid, token, serviceId, day}) =>
/*
({ uuid, token }) => new Promise((resolve, reject) => {
  resolve(business);
});
*/
export const getServiceTimes = ({
  service, token, uuid, day,
}) => {
  const start = 8;
  const end = 20;
  const uff = (end - start) * 4;
  const returnVal = [];
  for (let i = 0; i <= uff; i += 1) {
    returnVal.push({ time: newTime(start, i * 15), occupied: false });
  }

  return returnVal;
};

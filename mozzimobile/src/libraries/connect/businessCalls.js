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
    'Los bananeros capo como no me conoces penepene penepenepenepene penepenepenepene penepenepenepene penepenepenepene ',
  zone: 'CABA',
  services: [
    {
      name: 'hola',
    },
    {
      name: 'chau',
    },
    {
      name: 'cebo poneme un 10',
    },
  ],
  image: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
};

export const getStores = ({ search, token }) => res;
export const getSomething = () => {};
export const getBusiness = ({ uuid, token }) => business;

/*
({ uuid, token }) => new Promise((resolve, reject) => {
  resolve(business);
});
*/

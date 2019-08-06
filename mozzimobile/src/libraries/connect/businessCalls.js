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
  description: 'Los bananeros capo como no me conoces',
  zone: 'CABA',
  services: [],
  image: 'https://lh3.googleusercontent.com/-chmszxQw7Hj95y7QzRLu1fsE6zVsL0ZWs54mC7IzOFfKqUQCDCKScwcaxlaY7Cg6WXSCNtt84yUbd_q2MDL_TWAGEeTrOeXVNI0BBoGLOBvjP_2EJFG1xbYfyaauu1cZF_HkZEM4EaiQRccPJqLe1gpW_1ve5mTp25cr-3sf4wYOL9dch27D_ykVHoHTmx9k_SKwOY39rR_uD3CoYfTyOqYVxg2z0A8LWLMNZBgygaEk_e60A9zG35WuN1DL1vJ0SzqBAfRrfTAqfsI1H7vW3ZLQQgblfbumYjGEotqJRNn6fJztJtuZ2SfT-ZJ_L0X0e9YKxYcNmzxcmeiGpZOU9X-g4b7MVCFQu8Yhvo8OfoeSM2nNASnWZBRrXjtc6upI1p0mkboJs97-rzWFs-7kYqmsIwUmWTGeDAOQqa9_mJ3FJ9HgtuiLh-cZ18mxGQSNBWU26KyZamjlBg_ZKHVDoGk3582Y5d4vVrtCQfRT11U7vjzD7IXZIV5yjMHFM7MpJvEA9-86Lro0tnqz31FXwKVkg84aoPbBQXHMgp7irRbbAPWJkK_0zh_DkrHk4lXAb9aETjMMo51327nDm6cs5NdBIKhmcbfPW3yW4jSPbLDOrqF3WC6-TdlvXvjr_dsfoTDQfhKONE8mZ-RSXWik214DtIHWQU=w703-h937-no',
};

export const getStores = ({ search, token }) => res;
export const getSomething = () => {};
export const getBusiness = ({ uuid, token }) => {
  /*
     axios logic
  */
  return business;
};

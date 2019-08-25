const axios = require('axios');
const qs = require('qs');
const serverSettings = require('./server');

const appointments = [
  {
    business: {
      name: 'Hola',
      street: 'Nunez',
      number: 2757,
    },
    uuid: '10sasdi',
    start: 20,
    end: 10000000,
    service: {
      name: 'Ganaron los peronistas',
      price: 20,
    },
  },
  {
    business: {
      name: 'Hola',
      street: 'Nunez',
      number: 2757,
    },
    uuid: '10ssasdi',
    start: 20,
    end: 10,
    service: {
      name: 'Mis',
      price: 20,
    },
  },
  {
    business: {
      name: 'Hola',
      street: 'Nunez',
      number: 2757,
    },
    uuid: '10sdasdi',
    start: 20,
    end: 10,
    service: {
      name: 'Mis',
      price: 20,
    },
  },
];
export const getAppointments = ({ token }) => axios.post(
  `${serverSettings.serverURL}/graphql`,
  {
    query: `
          query Me {
            me {
              appointments {
                uuid
                service {
                  name
                  price
                  business {
                    name
                    uuid
                  }
                }
                slot {
                  day
                  start
                  finish
                }
              }
            }
          }
      `,
  },
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  },
);
export const removeAppointments = ({ token, uuid }) => axios.post(
  `${serverSettings.serverURL}/graphql`,
  {
    query: `
        mutation deleteAppointment($uuid: ID!) {
          appointmentDelete(uuid: $uuid)
        }
      `,
    variables: {
      uuid,
    },
  },
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  },
);;

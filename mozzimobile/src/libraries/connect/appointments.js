const axios = require('axios');
const qs = require('qs');
const serverSettings = require('./server');

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
);

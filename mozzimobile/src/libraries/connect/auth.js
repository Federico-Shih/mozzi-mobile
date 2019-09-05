const axios = require('axios');
const qs = require('qs');
const serverSettings = require('./server');

// Assuming parameters and returned successfully

/* Register function using GRAPHQL */
export const register = (name, surname, email, password) => new Promise((resolve, reject) => {
  axios
    .post(
      // Uses string formatting to insert each variable in the call
      `${serverSettings.serverURL}/graphql`,
      {
        // It sends the query in the data object, with query with the GRAPHQL query variables with its variables
        query: `
            mutation Register($creds: registerInput) {
                register(input: $creds)
            }
          `,
        variables: {
          creds: {
            email,
            password,
            name,
            lastname: surname,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      reject(new Error(error.message));
    });
});

/* REST API
const register = (name, surname, email, password) => {
    return new Promise((resolve, reject) => {
        axios({
            baseURL: serverSettings.serverURL,
            method: 'POST',
            url: serverSettings.endpoints.register,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                name: name,
                lastname: surname,
                email: email,
                password: password
            }),
        })
        .then((response) => {
            resolve(response);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

*/

// Login GRAPHQL query, instead of mutation its a query since we aren't changing data
export const login = (email, password) => new Promise((resolve, reject) => {
  axios
    .post(
      `${serverSettings.serverURL}/graphql`,
      {
        query: `
                query Login($creds: loginInput) {
                    login(input: $creds)
                }
                `,
        variables: {
          creds: {
            email,
            password,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      reject(new Error(error.message));
    });
});

/* LOGIN REST API
const login = (email, password) => {
    return new Promise((resolve, reject) => {
            axios({
                baseURL: serverSettings.serverURL,
                method: 'POST',
                url: serverSettings.endpoints.login,
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    email: email,
                    password: password
                }),
            })
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
};
*/

// Legacy REST API recover password function, when GRAPHQL endpoint is implemented will change
export const recoverPassword = email => new Promise((resolve, reject) => {
  axios({
    baseURL: serverSettings.serverURL,
    method: 'POST',
    url: serverSettings.endpoints.login,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      email,
    }),
  })
    .then((response) => {
      resolve(response);
    })
    .catch((error) => {
      reject(error);
    });
});

// Temporal API result
const User = {
  image: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
  name: 'Federico Shih',
};

// Gets user profile depending on token that will be used to get user information
export const getProfile = ({ token }) => axios.post(
  `${serverSettings.serverURL}/graphql`,
  {
    query: `
        query Profile {
          me {
            name
            lastname
            uuid
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

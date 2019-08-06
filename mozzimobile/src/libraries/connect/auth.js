const axios = require('axios');
const qs = require('qs');
const serverSettings = require('./server');

// Assuming parameters and returned successfully

export const register = (name, surname, email, password) => new Promise((resolve, reject) => {
  axios
    .post(
      `${serverSettings.serverURL}/graphql`,
      {
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

const User = {
  image: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
  name: 'Federico Shih',
};

export const getProfile = ({ token }) => {
  return User;
};

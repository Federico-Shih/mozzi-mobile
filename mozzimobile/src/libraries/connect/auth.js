const axios = require('axios');
const serverSettings = require('./server');
const qs = require('qs');

//Assuming parameters and returned successfully

export const register = (name, surname, email, password) => {
    return new Promise((resolve, reject) => {
        axios.post(serverSettings.serverURL + '/graphql', {
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
                    lastname: surname
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            throw new Error(error);
        });
    });
}


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


export const login = (email, password) => {
    return new Promise((resolve, reject) => {
            axios.post(serverSettings.serverURL + '/graphql', {
                query: `
                    query Login($creds: loginInput) {
                        login(input: $creds)
                    }
                `,
                variables: {
                    creds: {
                        email,
                        password
                    }
                }
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                throw new Error(error);
            });
        });
};

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

export const recoverPassword = (email) => {
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

const axios = require('axios');
const serverSettings = require('./server');

//Assuming parameters and returned successfully
export const register = (name, surname, email, password) => {
    return new Promise((resolve, reject) => {
        axios({
            baseURL: serverSettings.serverURL,
            timeout: 10000,
            url: serverSettings.endpoints.register,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                name: name,
                lastname: surname,
                email: email,
                password: password,
            }
        }).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
}

export const login = () => {

};
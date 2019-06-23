const axios = require('axios');
const serverSettings = require('./server');

//Assuming parameters and returned successfully
export default register = (name, surname, email, password) => {
    axios({
        baseURL: serverSettings.serverURL,
        timeout: 10000,
        url: serverSettings.endpoints.register,
        method: 'post',
        data: {
            name: name,
            lastname: surname,
            email: email,
            password: password
        }
    }).then((response) => {

        return response.data;

    }).catch((error) => {
        return {message: error.data.code, status: error.status};
    });

}
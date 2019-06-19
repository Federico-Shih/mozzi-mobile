export const CHANGE_PAGE = 'CHANGE_PAGE';
export const ADD_PERMISSIONS = 'ADD_PERMISSIONS';

export const ADD_LOGIN = 'ADD_LOGIN';

export const LOGIN_JSON = {
    type: ADD_LOGIN,
    form: {
        username:'',
        password: ''
    }    
};

export const ADD_REGISTER = 'ADD_REGISTER';

export const REGISTER_JSON = {
    type: ADD_REGISTER,
    form: {
        username: '',
        date: '',
        email: '',
        password: '',
    }  
};


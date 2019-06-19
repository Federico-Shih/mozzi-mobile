import {LOGGING_IN, LOADING} from './actions';

const initialState = {
    loggedIn: 'false',
    loading: 'false'
}

export default function reducer(state = initialState, action)
{
    switch(action.type)
    {
        case LOGGING_IN:
            return {...state, loggedIn:action.login};
        
        case LOADING:
            return {...state, loading:action.loading};

        default:
            return state;
    }
}

import {combineReducers} from 'redux';
import {CHANGE_PAGE} from 'actions';

const initialState = {
    currentPage:'initial'
}

function changePage (state = initialState, action) {
    switch(action.type) {
        case CHANGE_PAGE:
            return {...state, currentPage: action.currentPage};
        
        default:
            return state;
    }
}

const reducers = combineReducers({
    changePage,
});

export default reducers;
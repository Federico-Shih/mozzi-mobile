import {combineReducers} from 'redux';
import {CHANGE_PAGE} from './actions';

//List of functions to add
function changePageReducer (state = {currentPage:'initial'}, action) {
    switch(action.type) {
        case CHANGE_PAGE:
            return {...state, currentPage: action.currentPage};

        default:
            return state;
    }
}

//combine functions
/*
const reducers = combineReducers({
    changePage: changePageReducer,
});
*/
/*
function reducers(state = {}, action) {
    return  {
        changePage: changePageReducer(state.currentPage, action),
    }
};
*/

export default changePageReducer;
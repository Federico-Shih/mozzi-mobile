import {combineReducers} from 'redux';
import currentPage from './reducers/pageChangingReducer'
//combine functions

export default combineReducers({
    currentPage, 
});

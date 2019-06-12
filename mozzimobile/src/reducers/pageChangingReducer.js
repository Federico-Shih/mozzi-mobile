import {CHANGE_PAGE} from '../actions';

export default function currentPage (state = 'initial', action) {
    switch(action.type) {
        case CHANGE_PAGE:
            return action.currentPage;

        default:
            return state;
    }
}
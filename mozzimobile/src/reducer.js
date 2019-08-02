import { LOADING, GET_TOKEN, REMOVE_TOKEN } from './actions';

const initialState = {
  loading: false,
  token: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: action.loading };
    case GET_TOKEN:
      return { ...state, token: action.token };
    case REMOVE_TOKEN:
      return { ...state, token: '' };
    default:
      return state;
  }
}

import {
  LOADING,
  GET_TOKEN,
  REMOVE_TOKEN,
  ADD_BUSINESS_UUID,
  REMOVE_BUSINESS_UUID,
  SELECT_SERVICE,
  REMOVE_SERVICE,
  ADD_USER,
  REMOVE_USER,
} from './actions';

const initialState = {
  loading: false,
  token: '',
  businessUuid: '',
  service: '',
  user: {
    name: '',
    lastname: '',
    uuid: '',
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: action.loading };
    case GET_TOKEN:
      return { ...state, token: action.token };
    case REMOVE_TOKEN:
      return { ...state, token: '' };
    case ADD_BUSINESS_UUID:
      return { ...state, businessUuid: action.uuid };
    case REMOVE_BUSINESS_UUID:
      return { ...state, businessUuid: '' };
    case SELECT_SERVICE:
      return { ...state, service: action.id };
    case REMOVE_SERVICE:
      return { ...state, service: '' };
    case ADD_USER:
      return { ...state, user: action.user };
    case REMOVE_USER:
      return { ...state, user: { name: '', lastname: '', uuid: '' } };
    default:
      return state;
  }
}

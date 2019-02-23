import {
  LOGIN_START,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL
} from '../actions/types';

const INITIAL_STATE =
  { email: 'yossi@mail.com',
    password: '',
    user: "yossi",
    loading: false,
    error: ''
  };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_START:
      return { ...state, loading: true, error: "" };

    case EMAIL_CHANGED:
      return { ...state, email: action.payload, loading: false };

    case PASSWORD_CHANGED:
      return { ...state, password: action.payload, loading: false };

    case LOGIN_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, user: action.payload };

    case LOGIN_USER_FAIL:
      return { ...state, ...INITIAL_STATE, error: "Authetication failed" };

    default:
      return state;
  }
};

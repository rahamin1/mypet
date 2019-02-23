import * as actions from '../actions/action_types';

const initialState = {
  loginEmail: null,  // email when user is logged in
  authInProcess: false,
  error: null
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {

    case actions.AUTH_START:
      return {
        ...state,
        authInProcess: true,
        error: null
      };

      case actions.AUTH_DONE:
        return {
          ...state,
          authInProcess: false,
          error: null
        };

      case actions.AUTH_USER:
      return {
        ...state,
        loginEmail: action.email,
        error: null
      };

    case actions.SIGN_OUT_USER:
      return {
        ...state,
        loginEmail: "",
        error: null
      };

    case actions.AUTH_ERROR:
      return {
        ...state,
        loginEmail: "",
        authInProcess: false,
        error: action.payload.message
      };

    case actions.HIDE_MODAL:  // clear all modal errors
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

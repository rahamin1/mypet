import * as actions from '../actions/types';

const INITIAL_STATE = {
  email: '',
  uid: '',

  checkAuthInProcess: true, // upon initialization, a check is made
                            // In firebase, whether already logged in

  loginInProcess: false,
  loginError: '',

  signupInProcess: false,
  signupError: '',

  emailChangeInProcess: false,
  passwordChangeInProcess: false
};

export default function AuthReducer(state = INITIAL_STATE, action) {

  switch (action.type) {
    case actions.INIT_USER_STATE:
      return INITIAL_STATE;

    case actions.LOGIN_START:
      return { ...state, loginInProcess: true, loginError: '', email: '', uid: '' };

    case actions.LOGIN_USER_SUCCESS:
      return { ...state, loginInProcess: false, loginError: '',
        email: action.payload.email, uid: action.payload.uid };

    case actions.LOGIN_USER_FAIL:
      return { ...state, loginInProcess: false, loginError: action.payload.message,
        email: '', uid: '' };

    case actions.SIGNUP_START:
      return { ...state, signupInProcess: true, signupError: '', email: '', uid: '' };

    case actions.SIGNUP_USER_SUCCESS:
      return { ...state, signupInProcess: false, signupError: '',
        email: action.payload.email, uid: action.payload.uid };

    // Mark in the store that the user is signed-in
    case actions.AUTH_USER:
      return { ...state,
        email: action.payload.email, uid: action.payload.uid,
        checkAuthInProcess: false
      };

    case actions.SIGNUP_USER_FAIL:
      return { ...state, signupInProcess: false, signupError: action.payload.message,
        email: '', uid: '' };

    case actions.EMAIL_CHANGED:
      return { ...state, email: action.payload, emailChangeInProcess: false };

    case actions.PASSWORD_CHANGED:
      return { ...state, password: action.payload, passwordChangeInProcess: false };

    case actions.SIGN_OUT:
    case actions.SIGN_OUT_ALL:
      return { ...INITIAL_STATE, checkAuthInProcess: false };

    default:
      return state;
  }
}

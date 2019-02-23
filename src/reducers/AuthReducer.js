import * as actions from '../actions/types';

const INITIAL_STATE = {
  // userId reflects the current id used, taking into account
  // both login with email and facebook-login
  guest: false,  // marks if signed-in user is a guest
  userId: '',

  // data for login with email
  email: '',
  emailLoginUid: '',

  // facebook data
  fbToken: null,
  fbUser: null,
  fbExpires: 0,

  checkAuthInProcess: true, // upon initialization, a check is made
                            // In firebase, whether already logged in

  loginInProcess: false,
  loginError: '',

  signupInProcess: false,
  signupError: '',

  guestError: '',

  emailChangeInProcess: false,
  passwordChangeInProcess: false
};

export default function AuthReducer(state = INITIAL_STATE, action) {

  switch (action.type) {
    case actions.INIT_USER_STATE:
      return INITIAL_STATE;

    case actions.CHECKING_LOGIN_STATE:
      return { ...state, checkAuthInProcess: true };

    // Facebook actions
    case actions.FACEBOOK_LOGIN_START:
      return { ...state, checkAuthInProcess: true };

    case actions.FACEBOOK_LOGIN_SUCCESS:
    case actions.SIGNED_IN_FACEBOOK:
      {
        const { fbToken, fbUser, fbExpires } = action.payload;
        return { ...state,
          userId: fbUser, guest: false,
          fbToken, fbUser, fbExpires,
          checkAuthInProcess: false };
      }

    case actions.FACEBOOK_LOGIN_FAIL:
    case actions.SIGNED_OUT_FACEBOOK:
      return { ...state,
        userId: '',
        fbToken: null, fbUser: null, fbExpires: 0,
        checkAuthInProcess: false };

    // login-with-email or login-as-a-guest actions
    case actions.LOGIN_START:
    case actions.LOGIN_GUEST_START:
      return { ...state, loginInProcess: true,
        signupError: '', loginError: '', guestError: '',
        userId: '', email: '', emailLoginUid: '' };

    case actions.LOGIN_USER_SUCCESS:
      return { ...state, loginInProcess: false,
        signupError: '', loginError: '', guestError: '',
        userId: action.payload.email, guest: false,
        email: action.payload.email, emailLoginUid: action.payload.uid };

    case actions.LOGIN_GUEST_SUCCESS:
      return { ...state, loginInProcess: false,
        signupError: '', loginError: '', guestError: '',
        userId: action.payload.email, guest: true,
        email: action.payload.email, emailLoginUid: action.payload.uid };

    case actions.LOGIN_USER_FAIL:
      return { ...state, loginInProcess: false,
        loginError: action.payload.message,
        signupError: '', guestError: '',
        userId: '', email: '', emailLoginUid: '' };

    case actions.LOGIN_GUEST_FAIL:
      console.log('LOGIN_GUEST_FAIL');
      console.log(action.payload.message);
      return { ...state, loginInProcess: false,
        guestError: action.payload.message,
        signupError: '', loginError: '',
        userId: '', email: '', emailLoginUid: '' };

    case actions.SIGNUP_START:
      return { ...state, signupInProcess: true,
        signupError: '', loginError: '', guestError: '',
        userId: '', email: '', emailLoginUid: '' };

    case actions.SIGNUP_USER_SUCCESS:
      return { ...state, signupInProcess: false,
        signupError: '', loginError: '', guestError: '',
        userId: action.payload.email, guest: false,
        email: action.payload.email, emailLoginUid: action.payload.uid };

    // Mark in the store that the state of being signed-in-to firebase
    case actions.SIGNED_IN_FIREBASE:
    {
      const guest = (action.payload.email.substring(0, 6) === "guest_") ?
        true : false;
      return { ...state,
        userId: action.payload.email, guest: guest,
        email: action.payload.email, emailLoginUid: action.payload.uid,
        checkAuthInProcess: false
      };
    }

    // Mark in the store that the state of being signed-out-from firebase
    case actions.SIGNED_OUT_FIREBASE:
      return { ...state,
        userId: '',
        email: '', emailLoginUid: ''
      };

    case actions.SIGNUP_USER_FAIL:
      return { ...state,
        signupInProcess: false,
        signupError: action.payload.message, loginError: '', guestError: '',
        userId: '', email: '', emailLoginUid: '' };

    case actions.EMAIL_CHANGED:
    console.warn('in AuthReducer/EMAIL_CHANGED. Check parameters!');
      return { ...state,
        email: action.payload,
        emailChangeInProcess: false };

    case actions.PASSWORD_CHANGED:
      console.warn('in AuthReducer/PASSWORD_CHANGED. Check parameters!');
      return { ...state,
        password: action.payload, passwordChangeInProcess: false };

    case actions.SIGN_OUT_ALL:
      return { ...INITIAL_STATE, checkAuthInProcess: false };

    default:
      return state;
  }
}

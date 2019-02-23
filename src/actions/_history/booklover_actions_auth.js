import Firebase from 'firebase';
import * as actions from './action_types';
import { hideModal } from './actions_modal';

// Sign up to database and then mark the result in the store
export function signUpUser(credentials) {
  return (dispatch => {
    dispatch(authStart());
    Firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(response => {
        dispatch(authUser(credentials.email));
        dispatch(authDone());
        dispatch(hideModal());
      })
      .catch(error => {
        dispatch(authError(error));
      });
  });
}

// Sign in to database and then mark the result in the store
export function signInUser(credentials) {
  return (dispatch => {
    dispatch(authStart());
    Firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(response => {
        dispatch(authUser(credentials.email));
        dispatch(authDone());
        dispatch(hideModal());
      })
      .catch(error => {
        dispatch(authError(error));
      });
  });
}

// Sign out and then mark the result in the store
export function signOutUser(history) {
  if (history) {
    history.push('/');
  }

  return (dispatch => {
    Firebase.auth().signOut()
      .then(() => {
        dispatch(initUserState());
        dispatch({
          type: actions.SIGN_OUT_USER
        });
      });
  });
}

// Start the authorization process
export function authStart() {
  return {
    type: actions.AUTH_START
  };
}

// completed the authorization process
export function authDone() {
  return {
    type: actions.AUTH_DONE
  };
}

// Mark sign-in in the store
export function authUser(email) {
  return {
    type: actions.AUTH_USER,
    email: email
  };
}

// Mark sign-in error in the store
export function authError(error) {
  return {
    type: actions.AUTH_ERROR,
    payload: error
  };
}

export function verifyAuth() {
  return (dispatch => {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const email = user.email;
        setTimeout(() => {
          dispatch(authUser(email));
        }, 1000);
      } else {
        setTimeout(() => {
          dispatch(signOutUser());
        }, 1000);
      }
    });
  });
}

function initUserState() {
  return {
    type: actions.INIT_USER_STATE
  };
}

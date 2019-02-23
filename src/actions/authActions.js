// For explanation of next 4 lines see
// https://github.com/expo/expo/issues/1786#issuecomment-401362246
import firebase from 'firebase';
// import firebase from "@firebase/app";
// import "firebase/auth";
// import "firebase/database";
import { Constants } from 'expo';

//import { checkFacebookLogin } from 'mypet/helpers/facebookAuthHelpers';
import { checkFacebookLogin } from '../helpers/facebookAuthHelpers';
import * as actions from '../actions/types';

export const emailChanged = (text) => {
  return {
    type: actions.EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: actions.PASSWORD_CHANGED,
    payload: text
  };
};

export const loginUser = (payload, navigation) => {
  const { email, password } = payload;
  return (dispatch) => {
    dispatch({ type: actions.LOGIN_START });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(data => loginUserSuccess(dispatch, data.user, navigation))
      .catch((error) => loginUserFail(dispatch, error));
  };
};

export const loginGuest = (navigation) => {
  // user InstallationId to login
  const guestUser = `guest_${Constants.installationId}@mail.com`;
  return (dispatch) => {
    dispatch({ type: actions.LOGIN_GUEST_START });
    firebase.auth().signInWithEmailAndPassword(guestUser, '123456')
      .then(data => loginGuestSuccess(dispatch, data.user, navigation))
      .catch(() => {  // user doesn't exist, signup instead
        firebase.auth().createUserWithEmailAndPassword(guestUser, '123456')
          .then(data => loginGuestSuccess(dispatch, data.user, navigation))
          .catch((error) => loginGuestFail(dispatch, error));
      });
  };
};

const loginUserFail = (dispatch, error) => {
  dispatch({ type: actions.LOGIN_USER_FAIL, payload: error });
};

const loginUserSuccess = (dispatch, user, navigation) => {
  dispatch({ type: actions.LOGIN_USER_SUCCESS, payload: user });
  navigation.navigate('Main');
};

const loginGuestFail = (dispatch, error) => {
  dispatch({ type: actions.LOGIN_GUEST_FAIL, payload: error });
};

const loginGuestSuccess = (dispatch, user, navigation) => {
  dispatch({ type: actions.LOGIN_GUEST_SUCCESS, payload: user });
  navigation.navigate('Main');
};

export const signupUser = (payload, navigation) => {
  const { email, password } = payload;
  return (dispatch) => {
    dispatch({ type: actions.SIGNUP_START });
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(data => signupUserSuccess(dispatch, data.user, navigation))
      .catch((error) => signupUserFail(dispatch, error));
  };
};

const signupUserFail = (dispatch, error) => {
  dispatch({ type: actions.SIGNUP_USER_FAIL, payload: error });
};

const signupUserSuccess = (dispatch, user, navigation) => {
  dispatch({ type: actions.SIGNUP_USER_SUCCESS, payload: user });
  navigation.navigate('Main');
};

// Sign out and then mark the result in the store
export function signoutUser(email, navigation) {
  return (dispatch => {
    if (!email || email === '') {
      // this means that user didn't login through firebase,
      // but using facebook login (directly)
      dispatch({ type: actions.SIGN_OUT_ALL });
      navigation.navigate('Login');
    } else {
      // user logged in through firebase
      firebase.auth().signOut()
        .then(() => {
          dispatch({ type: actions.SIGN_OUT_ALL });
          navigation.navigate('Login');
        }, (error) => {
            console.warn("Failed to sign out from firebase. Error: ", error);
            dispatch({ type: actions.SIGN_OUT_ALL });
            navigation.navigate('Login');
        });
      }
  });
}

// Check if user is signed in
export function checkLoginState(fbToken, fbUser, fbExpires) {
  return (dispatch => {
    dispatch({ type: actions.CHECKING_LOGIN_STATE });
    firebase.auth().onAuthStateChanged(user => {
      if (user) { // still signed in to firebase
        dispatch(authUserFirebase(user));
      } else { // not signed-in to firebase. check facebook login status
        dispatch(noAuthUserFirebase());
        if (checkFacebookLogin(fbToken, fbExpires)) {
          dispatch({
            type: actions.SIGNED_IN_FACEBOOK,
            payload: { fbToken, fbUser, fbExpires }
          });
        } else {
          dispatch({ type: actions.SIGNED_OUT_FACEBOOK });
        }
      }
    });
  });
}

// Mark sign-in in the store
export function authUserFirebase(user) {
  return {
    type: actions.SIGNED_IN_FIREBASE,
    payload: user
  };
}

// Mark sign-out in the store
export function noAuthUserFirebase() {
  return {
    type: actions.SIGNED_OUT_FIREBASE
  };
}

import firebase from 'firebase';
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

const loginUserFail = (dispatch, error) => {
  dispatch({ type: actions.LOGIN_USER_FAIL, payload: error });
};

const loginUserSuccess = (dispatch, user, navigation) => {
  console.warn(user);
  dispatch({ type: actions.LOGIN_USER_SUCCESS, payload: user });
  navigation.navigate('Main');
};

export const signupUser = (payload, navigation) => {
  const { email, password } = payload;
  return (dispatch) => {
    dispatch({ type: actions.SIGNUP_START });
    console.warn('calling createUserWithEmailAndPassword');
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(data => signupUserSuccess(dispatch, data.user, navigation))
      .catch((error) => signupUserFail(dispatch, error));
  };
};

const signupUserFail = (dispatch, error) => {
  console.warn("In signupUserFail");
  console.warn(error);
  dispatch({ type: actions.SIGNUP_USER_FAIL, payload: error });
};

const signupUserSuccess = (dispatch, user, navigation) => {
  console.warn('success');
  dispatch({ type: actions.SIGNUP_USER_SUCCESS, payload: user });
  console.warn("In AuthActions/signupUserSuccess. Going to Main");
  navigation.navigate('Main');
};

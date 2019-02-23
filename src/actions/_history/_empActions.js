import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { EMP_UPDATE, EMP_UPDATE_DONE, EMP_CREATE_DONE, EMP_FETCH_SUCCESS } from './types';

export const empUpdate = ({ prop, value }) => {
  return {
    type: EMP_UPDATE,
    payload: { prop, value }
  };
};

export const empCreate = ({ name, phone, shift }) => {
  const { currentUser } = firebase.auth();

  return ((dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/emps`)
      .push({ name, phone, shift })
      .then(()  => {
        dispatch({ type: EMP_CREATE_DONE });

        // .then(() => Actions.pop());
        // or .then(() => Actions.EmpList({ type: 'reset' });
        Actions.pop();
      });
  });
};

export const empFetch = () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/emps`)
      .on('value', snapshot => {
        dispatch({ type: EMP_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const empSave = ({ name, phone, shift, uid }) => {
  const { currentUser } = firebase.auth();

  return ((dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/emps/${uid}`)
      .set({ name, phone, shift })
      .then(()  => {
        dispatch({ type: EMP_UPDATE_DONE });
        // .then(() => Actions.pop());
        // or .then(() => Actions.EmpList({ type: 'reset' });
        Actions.EmpList();
      });
  });
};

export const empDelete = ({ uid }) => {
  const { currentUser } = firebase.auth();

  return (() => {
    firebase.database().ref(`/users/${currentUser.uid}/emps/${uid}`)
      .remove()
      .then(() => {
        Actions.EmpList();
      });
  });
};

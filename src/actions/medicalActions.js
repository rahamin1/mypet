// For explanation of next 4 lines see
// https://github.com/expo/expo/issues/1786#issuecomment-401362246
import firebase from 'firebase';
// import firebase from "@firebase/app";
// import "firebase/auth";
// import "firebase/database";

import { Alert } from 'react-native';
import { maxItems } from '../constants/miscConstants';

import {
  MEDICAL_ADD_START, MEDICAL_ADD_SUCCESS, MEDICAL_ADD_FAIL,
  MEDICAL_UPDATE_START, MEDICAL_UPDATE_SUCCESS, MEDICAL_UPDATE_FAIL,
  MEDICAL_FETCH_START, MEDICAL_FETCH_SUCCESS, MEDICAL_FETCH_FAIL,
  MEDICAL_DELETE_START, MEDICAL_DELETE_SUCCESS, MEDICAL_DELETE_FAIL
} from './types';

// TODO check if internet connection is on

export const medicalAdd = (userId, formPayload, navigation) => {

  const { curTime, itemDate, type, details, notes } = formPayload;
  const user = normalizeUserId(userId); // prepare for firebase write

  return ((dispatch) => {
    dispatch({ type: MEDICAL_ADD_START });

    firebase.database().ref(`/users/${user}/medical`)
      .push({ curTime, itemDate, type, details, notes })
      .then(()  => {
        dispatch({ type: MEDICAL_ADD_SUCCESS, payload: formPayload });
        navigation.pop();
      })
      .catch((error) => {
        console.warn(`In medicalAdd. Failed: ${error}`);
        dispatch({ type: MEDICAL_ADD_FAIL, payload: error });
        alertMessage("Insert failed. Please try again later.");
      });
  });
};

export const medicalUpdate = (userId, formPayload, navigation) => {
  const { key, curTime, itemDate, type, details, notes } = formPayload;
  const user = normalizeUserId(userId); // prepare for firebase write

  return ((dispatch) => {
    dispatch({ type: MEDICAL_UPDATE_START });

    let updates = {};
    updates[`/users/${user}/medical/${key}`] = { curTime, itemDate, type, details, notes };
    firebase.database().ref().update(updates)
      .then(()  => {
        dispatch({ type: MEDICAL_UPDATE_SUCCESS, payload: formPayload });
        navigation.pop();
      })
      .catch((error) => {
        console.warn(`In medicalAdd. Failed: ${error}`);
        dispatch({ type: MEDICAL_UPDATE_FAIL, payload: error });
        alertMessage("Update failed. Please try again later.");
      });
  });
};

// Parameters of medicalsFetch:
// 1st - self explanataory
// 2nd - stratDate for displaed items. null means all items
// 3rd - display order (true - newestAtTop)
export const medicalsFetch = (userId, startDate, newestAtTop) => {
  return (dispatch) => {
    dispatch({ type: MEDICAL_FETCH_START });
    if (!userId || userId === '') {
      dispatch({
        type: MEDICAL_FETCH_FAIL,
        payload: 'Internal error: Unable to fetch medical items for a user that is not logged in.'
      });
      alertMessage("Internal error: please Sign-out and Sign-in again.");
      return;
    }

    const user = normalizeUserId(userId); // prepare for firebase write

    const start = (startDate === null) ?
      new Date(1970, 1, 1).getTime() : // null means all items
      startDate.getTime();

    if (newestAtTop === 1) {
      // reverse order (newest item first)
      firebase.database().ref(`/users/${user}/medical`).orderByChild('itemDate')
        .startAt(start).limitToLast(maxItems).on('value', snapshot => {

        // snapshot is converted to array by a loop
        // since this the only way I found to create an ordered
        // list for the reducer
        let medicals = [];
        if (snapshot.val()) {
          snapshot.forEach((child) => {
            medicals.push({ ...child.val(), key: child.key });
          });
        }
        medicals.reverse(); // newest at the top
        dispatch({ type: MEDICAL_FETCH_SUCCESS, payload: medicals });
      });
    } else {  // oldest items first
      firebase.database().ref(`/users/${user}/medical`).orderByChild('itemDate')
        .startAt(start).limitToFirst(maxItems).on('value', snapshot => {

        // snapshot is converted to array by a loop
        // since this the only way I found to create an ordered
        // list for the reducer
        let medicals = [];
        if (snapshot.val()) {
          snapshot.forEach((child) => {
            medicals.push({ ...child.val(), key: child.key });
          });
        }
        dispatch({ type: MEDICAL_FETCH_SUCCESS, payload: medicals });
      });
    }
  };
};

export const medicalsDelete = (userId, deletionList) => {
  return (dispatch) => {
    dispatch({ type: MEDICAL_DELETE_START });
    if (!userId || userId === '') {
      dispatch({
        type: MEDICAL_DELETE_FAIL,
        payload: 'Unable to delete medical entries for a user that is not logged in.'
      });
      alertMessage("Internal error: please Sign-out and Sign-in again.");
      return;
    } else if (deletionList.length === 0) {
      dispatch({
        type: MEDICAL_DELETE_FAIL,
        payload: 'No items selected to delete.'
      });
      alertMessage("No items selected to delete.");
      return;
    }

    const user = normalizeUserId(userId); // prepare for firebase write

    let updates = {};
    deletionList.map(key => {
      updates[key] = null; // setting value to null deletes the key
    });
    firebase.database().ref(`/users/${user}/medical`).update(updates);

/*
    deletionList.map(key => {
      firebase.database().ref((`/users/${email}/medical/${key}`)).remove();
    });
*/
    dispatch({ type: MEDICAL_DELETE_SUCCESS });
  };
};

// prepare for firebase write: cannot use . in firebase path
const normalizeUserId = (userId) => {
  return userId.replace(/[.\s]/g, '_');
};

const alertMessage = (msg) => {
  Alert.alert(
    msg,
    '',
    [
      { text: 'OK', onPress: () => {} }
    ],
    { cancelable: true }
  );
};

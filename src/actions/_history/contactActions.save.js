// For explanation of next 4 lines see
// https://github.com/expo/expo/issues/1786#issuecomment-401362246
import firebase from 'firebase';
// import firebase from "@firebase/app";
// import "firebase/auth";
// import "firebase/database";

import { Alert } from 'react-native';

import {
  CONTACT_ADD_START, CONTACT_ADD_SUCCESS, CONTACT_ADD_FAIL,
  CONTACT_UPDATE_START, CONTACT_UPDATE_SUCCESS, CONTACT_UPDATE_FAIL,
  CONTACT_FETCH_START, CONTACT_FETCH_SUCCESS, CONTACT_FETCH_FAIL,
  CONTACT_DELETE_START, CONTACT_DELETE_SUCCESS, CONTACT_DELETE_FAIL
} from './types';

// TODO check if internet connection is on

export const contactAdd = (userId, formPayload, navigation) => {

  const { curTime, name, photo, phone, mail, comments } = formPayload;
  const user = normalizeUserId(userId); // prepare for firebase write

  return ((dispatch) => {
    dispatch({ type: CONTACT_ADD_START });

    firebase.database().ref(`/users/${user}/contact`)
      .push({ curTime, name, photo, phone, mail, comments })
      .then(()  => {
        dispatch({ type: CONTACT_ADD_SUCCESS, payload: formPayload });
        navigation.pop();
      })
      .catch((error) => {
        console.warn(`In contactAdd. Failed: ${error}`);
        dispatch({ type: CONTACT_ADD_FAIL, payload: error });
        alertMessage("Insert failed. Please try again later.");
      });
  });
};

export const contactUpdate = (userId, formPayload, navigation) => {
  const { key, curTime, name, photo, phone, mail, comments } = formPayload;
  const user = normalizeUserId(userId); // prepare for firebase write

  return ((dispatch) => {
    dispatch({ type: CONTACT_UPDATE_START });

    let updates = {};
    updates[`/users/${user}/contact/${key}`] = { curTime, name, photo, phone, mail, comments };
    firebase.database().ref().update(updates)
      .then(()  => {
        dispatch({ type: CONTACT_UPDATE_SUCCESS, payload: formPayload });
        navigation.pop();
      })
      .catch((error) => {
        console.warn(`In contactAdd. Failed: ${error}`);
        dispatch({ type: CONTACT_UPDATE_FAIL, payload: error });
        alertMessage("Update failed. Please try again later.");
      });
  });
};

// Parameters of contactsFetch:
// 1st - self explanataory
// 2nd - searchString for displaed items. null means all items
export const contactsFetch = (userId, searchString) => {
  return (dispatch) => {
    dispatch({ type: CONTACT_FETCH_START });
    if (!userId || userId === '') {
      dispatch({
        type: CONTACT_FETCH_FAIL,
        payload: 'Internal error: Unable to fetch contact items for a user that is not logged in.'
      });
      alertMessage("Internal error: please Sign-out and Sign-in again.");
      return;
    }

    const user = normalizeUserId(userId); // prepare for firebase write

    // Once
    /*
    firebase.database().ref(`/users/${email}/contact`).orderByChild('itemDate').once('value')
      .then((snapshot) => {
        const contacts = snapshot.val() ? snapshot.val() : {};
        dispatch({ type: CONTACT_FETCH_SUCCESS, payload: contacts });
      })
      .catch((error) => {
        dispatch({ type: CONTACT_FETCH_FAIL, payload: error });
      });
    */

    // Continuous
    // firebase.database().ref(`/users/${user}/contact`).orderByChild('itemDate')
    //.on('value', snapshot => {

    if (searchString === null) {
      // display all items
      firebase.database().ref(`/users/${user}/contact`)
        .orderByChild('name').on('value', snapshot => {

        // snapshot is converted to array by a loop
        // since this the only way I found to create an ordered
        // list for the reducer
        let contacts = [];
        if (snapshot.val()) {
          snapshot.forEach((child) => {
            contacts.push({ ...child.val(), key: child.key });
          });
        }
        dispatch({ type: CONTACT_FETCH_SUCCESS, payload: contacts });
      });
    } else {  // search by the searchString
      // There are two cases for serach: with or without a wilcard (*)
      if (searchString.substring(searchString.length - 1) !== "*") {
        firebase.database().ref(`/users/${user}/contact`)
          .orderByChild('name')
          .equalTo(searchString).on('value', snapshot => {
            // snapshot is converted to array by a loop
            // since this the only way I found to create an ordered
            // list for the reducer
            let contacts = [];
            if (snapshot.val()) {
              snapshot.forEach((child) => {
                contacts.push({ ...child.val(), key: child.key });
              });
            }
            dispatch({ type: CONTACT_FETCH_SUCCESS, payload: contacts });
          });
        } else {  // search with wildcard ('*' at the end)
        // '~' is used as end string, since it is the last character
        // in the unicode table for letters
        const searchStringStart =
          searchString.substring(0, searchString.length - 1);
        const searchStringEnd = searchStringStart + '~';
        firebase.database().ref(`/users/${user}/contact`)
          .orderByChild('name')
          .startAt(searchStringStart).endAt(searchStringEnd)
          .on('value', snapshot => {
            let contacts = [];
            if (snapshot.val()) {
              snapshot.forEach((child) => {
                contacts.push({ ...child.val(), key: child.key });
              });
            }
            dispatch({ type: CONTACT_FETCH_SUCCESS, payload: contacts });
          });
        }
    }
  };
};

export const contactsDelete = (userId, deletionList) => {
  return (dispatch) => {
    dispatch({ type: CONTACT_DELETE_START });
    if (!userId || userId === '') {
      dispatch({
        type: CONTACT_DELETE_FAIL,
        payload: 'Unable to delete contact entries for a user that is not logged in.'
      });
      alertMessage("Internal error: please Sign-out and Sign-in again.");
      return;
    } else if (deletionList.length === 0) {
      dispatch({
        type: CONTACT_DELETE_FAIL,
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
    firebase.database().ref(`/users/${user}/contact`).update(updates);

/*
    deletionList.map(key => {
      firebase.database().ref((`/users/${email}/contact/${key}`)).remove();
    });
*/
    dispatch({ type: CONTACT_DELETE_SUCCESS });
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

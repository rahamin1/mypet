import firebase from 'firebase';
import { Alert } from 'react-native';

import {
  PHOTO_ADD_START, PHOTO_ADD_SUCCESS, PHOTO_ADD_FAIL,
  PHOTO_UPDATE_START, PHOTO_UPDATE_SUCCESS, PHOTO_UPDATE_FAIL,
  PHOTO_FETCH_START, PHOTO_FETCH_SUCCESS, PHOTO_FETCH_FAIL,
  PHOTO_DELETE_START, PHOTO_DELETE_SUCCESS, PHOTO_DELETE_FAIL
} from './types';

export const photoAdd = (userId, formPayload, navigation) => {

  const { curTime, itemDate, photo, title, notes } = formPayload;
  const user = normalizeUserId(userId); // prepare for firebase write

  return ((dispatch) => {
    dispatch({ type: PHOTO_ADD_START });

    firebase.database().ref(`/users/${user}/photos`)
      .push({ curTime, itemDate, photo, title, notes })
      .then(()  => {
        dispatch({ type: PHOTO_ADD_SUCCESS, payload: formPayload });
        navigation.pop();
      })
      .catch((error) => {
        console.warn(`In photoAdd. Failed: ${error}`);
        dispatch({ type: PHOTO_ADD_FAIL, payload: error });
        alertMessage("Insert failed. Please try again later.");
      });
  });
};

export const photoUpdate = (userId, formPayload, navigation) => {
  const { key, curTime, itemDate, photo, title, notes } = formPayload;
  const user = normalizeUserId(userId); // prepare for firebase write

  return ((dispatch) => {
    dispatch({ type: PHOTO_UPDATE_START });

    let updates = {};
    updates[`/users/${user}/photos/${key}`] = { curTime, itemDate, photo, title, notes };
    firebase.database().ref().update(updates)
      .then(()  => {
        dispatch({ type: PHOTO_UPDATE_SUCCESS, payload: formPayload });
        navigation.pop();
      })
      .catch((error) => {
        console.warn(`In photoAdd. Failed: ${error}`);
        dispatch({ type: PHOTO_UPDATE_FAIL, payload: error });
        alertMessage("Update failed. Please try again later.");
      });
  });
};

export const photosFetch = (userId) => {
  console.log("**** In photosFetch. userId: ", userId);
  return (dispatch) => {
    dispatch({ type: PHOTO_FETCH_START });
    if (!userId || userId === '') {
      dispatch({
        type: PHOTO_FETCH_FAIL,
        payload: 'Internal error: Unable to fetch photos for a user that is not logged in.'
      });
      alertMessage("Internal error: please Sign-out and Sign-in again.");
      return;
    }

    const user = normalizeUserId(userId); // prepare for firebase write

    // Once
    /*
    firebase.database().ref(`/users/${email}/photos`).orderByChild('itemDate').once('value')
      .then((snapshot) => {
        const photos = snapshot.val() ? snapshot.val() : {};
        dispatch({ type: PHOTO_FETCH_SUCCESS, payload: photos });
      })
      .catch((error) => {
        dispatch({ type: PHOTO_FETCH_FAIL, payload: error });
      });
    */

    // Continuous
    firebase.database().ref(`/users/${user}/photos`).orderByChild('itemDate')
      .on('value', snapshot => {

        // snapshot is converted to array by a loop
        // since this the only way I found to create an ordered
        // list for the reducer
        let photos = [];
        if (snapshot.val()) {
          snapshot.forEach((child) => {
            photos.push({ ...child.val(), key: child.key });
          });
        }
        photos.reverse(); // newest at the top
        dispatch({ type: PHOTO_FETCH_SUCCESS, payload: photos });
      });
  };
};

export const photosDelete = (userId, deletionList) => {
  return (dispatch) => {
    dispatch({ type: PHOTO_DELETE_START });
    if (!userId || userId === '') {
      dispatch({
        type: PHOTO_DELETE_FAIL,
        payload: 'Unable to delete photo entries for a user that is not logged in.'
      });
      return;
    } else if (deletionList.length === 0) {
      dispatch({
        type: PHOTO_DELETE_FAIL,
        payload: 'No items selected to delete.'
      });
      return;
    }

    const user = normalizeUserId(userId); // prepare for firebase write

    let updates = {};
    deletionList.map(key => {
      updates[key] = null; // setting value to null deletes the key
    });
    firebase.database().ref(`/users/${user}/photos`).update(updates);

/*
    deletionList.map(key => {
      firebase.database().ref((`/users/${email}/photos/${key}`)).remove();
    });
*/
    dispatch({ type: PHOTO_DELETE_SUCCESS });
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

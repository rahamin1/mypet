// For explanation of next 4 lines see
// https://github.com/expo/expo/issues/1786#issuecomment-401362246
import firebase from 'firebase';
// import firebase from "@firebase/app";
// import "firebase/auth";
// import "firebase/database";

import { Alert } from 'react-native';

import {
  INIT_PET_STATE,
  PET_UPDATE_START, PET_UPDATE_SUCCESS, PET_UPDATE_FAIL,
  PET_FETCH_START, PET_FETCH_SUCCESS, PET_FETCH_FAIL
} from './types';

export const petUpdate = (userId, curPhoto, formPayload, navigation) => {

  let { photo } = formPayload;
  const { name, birthday, notes } = formPayload;
  const user = normalizeUserId(userId); // prepare for firebase write
  const curTime = Date.now();

  return (async(dispatch) => {
    dispatch({ type: PET_UPDATE_START });

    if (photo !== curPhoto) { //otherwise no need to upload the photo
      const uploadUrl = await uploadImageAsync(userId, curTime, photo);
      if (uploadUrl === null) {
        console.warn(`In photoAdd. Failed to write the image to firebase`);
        dispatch({ type: PET_UPDATE_FAIL, payload: "Failed to write the image to firebase" });
        alertMessage("Add Image failed. Please try again later.");
        return;
      }
      photo = uploadUrl;
    }

    firebase.database().ref(`/users/${user}/pet`)
      .set({ name, birthday, photo, notes })
      .then(()  => {
        navigation.navigate('Main');
        dispatch({ type: PET_UPDATE_SUCCESS, payload: formPayload });
      })
      .catch((error) => {
        console.warn(`In petUpdate. Failed: ${error}`);
        dispatch({ type: PET_UPDATE_FAIL, payload: error });
        alertMessage("Insert failed. Please try again later.");
      });
  });
};

export const petFetch = (userId) => {
  return (dispatch) => {
    dispatch({ type: PET_FETCH_START });
    if (!userId || userId === '') {
      dispatch({
        type: PET_FETCH_FAIL,
        payload: 'Internal error: Unable to fetch pet details for a user that is not logged in.'
      });
      alertMessage("Internal error: Unable to fetch pet details.",
        "Please Sign-out and Sign-in again.");
      return;
    }

    const user = normalizeUserId(userId); // prepare for firebase write

    firebase.database().ref(`/users/${user}/pet`)
      .on('value', snapshot => {
        dispatch({ type: PET_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

// prepare for firebase write: cannot use . in firebase path
const normalizeUserId = (userId) => {
  return userId.replace(/[.\s]/g, '_');
};

const alertMessage = (msg, msg2 = '') => {
  Alert.alert(
    msg,
    msg2,
    [
      { text: 'OK', onPress: () => {} }
    ],
    { cancelable: true }
  );
};

const uploadImageAsync = async(userId, curTime, photoUri) => {
  const user = normalizeUserId(userId); // prepare for firebase write

  let firebaseImageUrl = null;
  const response = await fetch(photoUri);
  const blob = await response.blob();
  const ref = firebase
    .storage()
    .ref(`${user}/pet`)
    .child(curTime.toString());

    await ref.put(blob).then(async(snapshot) => {
      await snapshot.ref.getDownloadURL().then(uploadURL => {
        firebaseImageUrl = uploadURL;
      }, (error) => { // failed to get uploadedURL location
        console.log('petActions/uploadImageAsync. Failed to get uploaded image URL. error: ');
        console.log(error);
        return null;
      });
    }, (error) => { // failed to upload image to firebase storage
      console.log('petActions/uploadImageAsync. Failed to upload image to firebase. error: ');
      console.log(error);
      return null;
    });

    return firebaseImageUrl;
};

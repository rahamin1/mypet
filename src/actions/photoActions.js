// For explanation of next 4 lines see
// https://github.com/expo/expo/issues/1786#issuecomment-401362246
import firebase from 'firebase';
//import firebase from "@firebase/app";
//import "firebase/auth";
//import "firebase/database";
import { FileSystem } from 'expo';

import { Alert } from 'react-native';
import { maxItems } from '../constants/miscConstants';

import {
  PHOTO_ADD_START, PHOTO_ADD_SUCCESS, PHOTO_ADD_FAIL,
  PHOTO_UPDATE_START, PHOTO_UPDATE_SUCCESS, PHOTO_UPDATE_FAIL,
  PHOTO_FETCH_START, PHOTO_FETCH_SUCCESS, PHOTO_FETCH_FAIL,
  PHOTO_DELETE_START, PHOTO_DELETE_SUCCESS, PHOTO_DELETE_FAIL
} from './types';

export const photoAdd = (userId, formPayload, navigation) => {

  let { photo } = formPayload;
  const { curTime, itemDate, title, notes } = formPayload;
  const user = normalizeUserId(userId); // prepare for firebase write

  return (async(dispatch) => {
    dispatch({ type: PHOTO_ADD_START });

    console.log('Calling uploadImageAsync');
    const uploadUrl = await uploadImageAsync(userId, curTime, photo);
    if (uploadUrl === null) {
      console.warn(`In photoAdd. Failed to write the image to firebase`);
      dispatch({ type: PHOTO_ADD_FAIL, payload: "Failed to write the image to firebase" });
      alertMessage("Add Image failed. Please try again later.");
      return;
    }

    photo = uploadUrl;
    firebase.database().ref(`/users/${user}/photos`)
      .push({ curTime, itemDate, photo, title, notes })
      .then(()  => {
        navigation.pop();
        dispatch({ type: PHOTO_ADD_SUCCESS, payload: formPayload });
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

// Parameters of photosFetch:
// 1st - self explanataory
// 2nd - stratDate for displaed items. null means all items
// 3rd - display order (true - newestAtTop)
export const photosFetch = (userId, startDate, newestAtTop) => {
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

    const start = (startDate === null) ?
      new Date(1970, 1, 1).getTime() : // null means all items
      startDate.getTime();

    if (newestAtTop === 1) {
      // reverse order (newest item first)
      firebase.database().ref(`/users/${user}/photos`).orderByChild('itemDate')
        .startAt(start).limitToLast(maxItems).on('value', snapshot => {
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
    } else {  // oldest items first
      firebase.database().ref(`/users/${user}/photos`).orderByChild('itemDate')
        .startAt(start).limitToFirst(maxItems).on('value', snapshot => {

        // snapshot is converted to array by a loop
        // since this the only way I found to create an ordered
        // list for the reducer
        let photos = [];
        if (snapshot.val()) {
          snapshot.forEach((child) => {
            photos.push({ ...child.val(), key: child.key });
          });
        }
        dispatch({ type: PHOTO_FETCH_SUCCESS, payload: photos });
      });
    }
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
      alertMessage("Internal error: please Sign-out and Sign-in again.");
      return;
    } else if (deletionList.length === 0) {
      dispatch({
        type: PHOTO_DELETE_FAIL,
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

const uploadImageAsync = async(userId, curTime, photoUri) => {
  console.log("In photoActions/uploadImageAsync. starting.");
  const user = normalizeUserId(userId); // prepare for firebase write
  let firebaseImageUrl = null;
  console.log("In photoActions/uploadImageAsync. await fetch starting. photoUri: ", photoUri);
  // const response = await axios.get(photoUri);
  // const response = await fetch(photoUri);
  let base64String;
  try {
    base64String = await FileSystem.readAsStringAsync(photoUri,
      { encoding: FileSystem.EncodingTypes.Base64 });
  } catch (error) {
    console.log('photoActions/uploadImageAsync. Failed to fetch image from cache. error: ');
    console.log(error);
    return null;
  }
  console.log("In photoActions/uploadImageAsync. await fetch completed.");
  console.log("In photoActions/uploadImageAsync. printed response");
  //console.log("In photoActions/uploadImageAsync. await response.blob starting.");

  /*
  let blob;
  try {
    setTimeout(() => null, 0);
    blob = await response.blob();
  } catch (error) {
    console.log('photoActions/uploadImageAsync.' +
      'Failed to read blob from fetch\'s response. error: ');
    console.log(error);
    return null;
  }
  */

  console.log("In photoActions/uploadImageAsync. getting firebase ref");
  const ref = await firebase.storage().ref(user).child(curTime.toString());

  console.log("In photoActions/uploadImageAsync. putString(base64) starting.");
  //await ref.putString('data:image/jpg;base64,' + response, 'base64',

  await ref.putString(base64String, 'base64', { contentType: 'image/jpeg' })
  .then(async(snapshot) => {
    console.log("In photoActions/uploadImageAsync. putString(base64) completed.");
    console.log("In photoActions/uploadImageAsync. ref.getDownloadURL starting.");
    await snapshot.ref.getDownloadURL().then(uploadURL => {
      firebaseImageUrl = uploadURL;
    }, (error) => { // failed to get uploadedURL location
      console.log('photoActions/uploadImageAsync. Failed to get uploaded image URL. error: ');
      console.log(error);
      return null;
    });
  }, (error) => { // failed to upload image to firebase storage
    console.log('photoActions/uploadImageAsync. Failed to upload image to firebase. error: ');
    console.log(error);
    return null;
  });

  console.log("In photoActions/uploadImageAsync. ref.getDownloadURL completed. url: ");
  console.log(firebaseImageUrl);
  return firebaseImageUrl;
};

export const uploadAsFile = async(uri) => {

  console.log("uploadAsFile", uri);
  const response = await fetch(uri);
  const blob = await response.blob();

  var metadata = {
    contentType: 'image/jpeg'
  };

  let name = new Date().getTime() + "-media.jpg";
  const ref = firebase
    .storage()
    .ref()
    .child('/images/' + name);

  const task = ref.put(blob, metadata);

  await task.on(
    'state_changed',
    (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      // (error) => reject(error), /* this is where you would put an error callback! */
    (error) => {
      console.log(`photoActions/uploadAsFile. Error writing image to firebase. error:`);
      console.log(error);
      return null;
    }, () => {  // success
      const downloadURL = task.snapshot.downloadURL;
      console.log("photoActions/uploadAsFile. Image uploaded as byte array ", downloadURL);

      return downloadURL;
    }
  );
};

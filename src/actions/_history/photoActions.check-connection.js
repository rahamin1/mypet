import firebase from 'firebase';
import {
  PHOTO_ADD_START, PHOTO_ADD_SUCCESS, PHOTO_ADD_FAIL,
  PHOTO_UPDATE_START, PHOTO_UPDATE_SUCCESS, PHOTO_UPDATE_FAIL,
  PHOTO_FETCH_START, PHOTO_FETCH_SUCCESS, PHOTO_FETCH_FAIL,
  PHOTO_DELETE_START, PHOTO_DELETE_SUCCESS, PHOTO_DELETE_FAIL
} from './types';

export const photoAdd = (userEmail, formPayload, navigation) => {

  const { curTime, itemDate, photo, title, notes } = formPayload;
  const email = cleanEmail(userEmail); // prepare for firebase write

  return ((dispatch) => {
    dispatch({ type: PHOTO_ADD_START });

    // check if firebase is connected
    const connected = firebase.database().ref(`.info/connected`);
    if (connected) {
      firebase.database().ref(`/users/${email}/photos`)
        .push({ curTime, itemDate, photo, title, notes })
        .then(()  => {
          dispatch({ type: PHOTO_ADD_SUCCESS, payload: formPayload });
          navigation.pop();
        })
        .catch((error) => {
          console.warn(`In photoAdd. Failed: ${error}`);
          dispatch({ type: PHOTO_ADD_FAIL, payload: error });
        });
      } else { // no connection to firebase
        dispatch({ type: PHOTO_ADD_FAIL, payload:
          "Check you internet connection and try to refresh the page." });
      }
  });
};

export const photoUpdate = (userEmail, formPayload, navigation) => {
  const { key, curTime, itemDate, photo, title, notes } = formPayload;
  const email = cleanEmail(userEmail); // prepare for firebase write

  return ((dispatch) => {
    dispatch({ type: PHOTO_UPDATE_START });

    let updates = {};
    updates[`/users/${email}/photos/${key}`] = { curTime, itemDate, photo, title, notes };
    firebase.database().ref().update(updates)
      .then(()  => {
        dispatch({ type: PHOTO_UPDATE_SUCCESS, payload: formPayload });
        navigation.pop();
      })
      .catch((error) => {
        console.warn(`In photoAdd. Failed: ${error}`);
        dispatch({ type: PHOTO_UPDATE_FAIL, payload: error });
      });
  });
};

export const photosFetch = (userEmail) => {
  return (dispatch) => {
    // check if firebase is connected

    const connectedRef = firebase.database().ref(".info/connected");
    console.log('In photosFetch. connectedRef: ', connectedRef);
    connectedRef.on("value", function(snap) {
      console.log('In photosFetch. connection status: ', snap);
      if (snap.val() !== true) {
        dispatch({ type: PHOTO_FETCH_FAIL, payload:
         "Check you internet connection and try to refresh the page." });
      } else {
        dispatch({ type: PHOTO_FETCH_START });
        if (!userEmail || userEmail === '') {
          dispatch({
            type: PHOTO_FETCH_FAIL,
            payload: 'Unable to fetch photos for a user that is not logged in.'
          });
          return;
        }

        const email = cleanEmail(userEmail); // prepare for firebase write

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
        firebase.database().ref(`/users/${email}/photos`).orderByChild('itemDate')
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
      }
    });
  };
};

export const photosDelete = (userEmail, deletionList) => {
  return (dispatch) => {
    dispatch({ type: PHOTO_DELETE_START });
    if (!userEmail || userEmail === '') {
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

    const email = cleanEmail(userEmail); // prepare for firebase write

    let updates = {};
    deletionList.map(key => {
      updates[key] = null; // setting value to null deletes the key
    });
    firebase.database().ref(`/users/${email}/photos`).update(updates);

/*
    deletionList.map(key => {
      firebase.database().ref((`/users/${email}/photos/${key}`)).remove();
    });
*/
    dispatch({ type: PHOTO_DELETE_SUCCESS });
  };
};

// prepare for firebase write: cannot use . in firebase path
const cleanEmail = (userEmail) => {
  return userEmail.replace(/[.]/g, '_');
};

/*
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
*/

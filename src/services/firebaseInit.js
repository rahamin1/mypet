// For explanation of next 4 lines see
// https://github.com/expo/expo/issues/1786#issuecomment-401362246
import firebase from 'firebase';
// import firebase from "@firebase/app";
// import "firebase/auth";
// import "firebase/database";

/* MyPet database
const config = {
  apiKey: "AIzaSyDuzbFAYqMjVM340vOThCRlhd4zzZImV2E",
  authDomain: "mypet-87ad4.firebaseapp.com",
  databaseURL: "https://mypet-87ad4.firebaseio.com",
  projectId: "mypet-87ad4",
  storageBucket: "mypet-87ad4.appspot.com",
  messagingSenderId: "1057984672702"
};
*/

/* native-sample database */
const config = {
  apiKey: "AIzaSyDYHjlG0uFDl-e-Cauc-tPqUOwVzYijK-o",
  authDomain: "native-sample-68693.firebaseapp.com",
  databaseURL: "https://native-sample-68693.firebaseio.com",
  projectId: "native-sample-68693",
  storageBucket: "native-sample-68693.appspot.com",
  messagingSenderId: "151979448966"
};

const firebaseInit = () => {
  firebase.initializeApp(config);
};

export default firebaseInit;

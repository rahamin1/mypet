import {
  INIT_USER_STATE,
  PHOTO_ADD_START, PHOTO_ADD_SUCCESS, PHOTO_ADD_FAIL,
  PHOTO_UPDATE_START, PHOTO_UPDATE_SUCCESS, PHOTO_UPDATE_FAIL,
  PHOTO_FETCH_START, PHOTO_FETCH_SUCCESS, PHOTO_FETCH_FAIL,
  SIGN_OUT_ALL
} from '../actions/types';
// import { photoTypes } from '../constants/photo';

//
const INITIAL_STATE = {
  // photos: [photoItem0, photoItem1, photoItem2, photoItem3, photoItem4, photoItem5],
  photos: [],

  fetchInProgress: false,
  fetchError: '',

  addInProgress: false,
  addError: ''
};

export default function PhotoReducer(state = INITIAL_STATE, action) {

  console.log('--------------- action: ', action.type);
  switch (action.type) {
    case INIT_USER_STATE:
      return INITIAL_STATE;

    case PHOTO_ADD_START:
      return { ...state, addInProgress: true, error: ''  };

    case PHOTO_ADD_SUCCESS:
      return { ...state, addInProgress: false, error: '' };

    case PHOTO_ADD_FAIL:
      return { ...state, addInProgress: false, error: action.payload  };

    case PHOTO_UPDATE_START:
      return { ...state, updateInProgress: true, error: ''  };

    case PHOTO_UPDATE_SUCCESS:
      return { ...state, updateInProgress: false, error: '' };

    case PHOTO_UPDATE_FAIL:
      return { ...state, updateInProgress: false, error: action.payload  };

    case PHOTO_FETCH_START:
      return { ...state, fetchInProgress: true };

    case PHOTO_FETCH_SUCCESS:
      if (!action.payload)
        return { ...state, fetchInProgress: false, photos: [] };
      else {
        return { ...state, fetchInProgress: false, photos: action.payload };
      }

    case PHOTO_FETCH_FAIL:
      return { ...state, fetchInProgress: false, error: action.payload };

    case SIGN_OUT_ALL:
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}

/*

const d = new Date();
const d0 = d.toLocaleDateString();
d.setMonth(d.getMonth() - 3);
const d1 = d.toLocaleDateString();
d.setMonth(d.getMonth() - 3);
const d2 = d.toLocaleDateString();
d.setMonth(d.getMonth() - 3);
const d3 = d.toLocaleDateString();
d.setMonth(d.getMonth() - 3);
const d4 = d.toLocaleDateString();
d.setMonth(d.getMonth() - 3);
const d5 = d.toLocaleDateString();

const keys = Object.keys(photoTypes);

const photoItem0 = {
  curTime: d0,
  date: d0,
  type: keys[0]
};

const photoItem1 = {
  curTime: d1,
  date: d1,
  type: keys[1]
};

const photoItem2 = {
  curTime: d2,
  date: d2,
  type: keys[2]
};

const photoItem3 = {
  curTime: d3,
  date: d3,
  type: keys[3]
};

const photoItem4 = {
  curTime: d4,
  date: d4,
  type: keys[4]
};

const photoItem5 = {
  curTime: d5,
  date: d5,
  type: keys[4]
};
*/

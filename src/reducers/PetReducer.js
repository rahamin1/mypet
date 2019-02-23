import {
  INIT_PET_STATE,
  PET_UPDATE_START, PET_UPDATE_SUCCESS, PET_UPDATE_FAIL,
  PET_FETCH_START, PET_FETCH_SUCCESS, PET_FETCH_FAIL,
  SIGN_OUT_ALL
} from '../actions/types';

//
const INITIAL_STATE = {
  name: '',
  photo: '',
  birthday: '',
  notes: '',

  fetchInProgress: false,
  fetchError: '',

  updateInProgress: false,
  updateError: ''
};

export default function PetReducer(state = INITIAL_STATE, action) {

  switch (action.type) {
    case INIT_PET_STATE:
      return { ...INITIAL_STATE };

    case PET_UPDATE_START:
      return { ...state, updateInProgress: true, error: ''  };

    case PET_UPDATE_SUCCESS:
      return { ...state, updateInProgress: false, ...action.payload };

    case PET_UPDATE_FAIL:
      return { ...state, updateInProgress: false, error: action.payload  };

    case PET_FETCH_START:
      return { ...state, fetchInProgress: true };

    case PET_FETCH_SUCCESS:
      if (!action.payload)
        return { ...INITIAL_STATE };
      else {
        return { ...state, fetchInProgress: false, ...action.payload };
      }

    case PET_FETCH_FAIL:
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

const photoItem0 = {
  curTime: d0,
  date: d0,
  type: keys[0]
};
*/

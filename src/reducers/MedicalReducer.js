import {
  INIT_USER_STATE,
  MEDICAL_ADD_START, MEDICAL_ADD_SUCCESS, MEDICAL_ADD_FAIL,
  MEDICAL_UPDATE_START, MEDICAL_UPDATE_SUCCESS, MEDICAL_UPDATE_FAIL,
  MEDICAL_FETCH_START, MEDICAL_FETCH_SUCCESS, MEDICAL_FETCH_FAIL,
  SIGN_OUT_ALL
} from '../actions/types';

const INITIAL_STATE = {
  // medicals: [medicalItem0, medicalItem1, medicalItem2, medicalItem3, medicalItem4, medicalItem5],
  medicals: [],

  fetchInProgress: false,
  fetchError: '',

  addInProgress: false,
  addError: ''
};

export default function MedicalReducer(state = INITIAL_STATE, action) {

  switch (action.type) {
    case INIT_USER_STATE:
      return INITIAL_STATE;

    case MEDICAL_ADD_START:
      return { ...state, addInProgress: true, error: ''  };

    case MEDICAL_ADD_SUCCESS:
      return { ...state, addInProgress: false, error: '' };

    case MEDICAL_ADD_FAIL:
      return { ...state, addInProgress: false, error: action.payload  };

    case MEDICAL_UPDATE_START:
      return { ...state, updateInProgress: true, error: ''  };

    case MEDICAL_UPDATE_SUCCESS:
      return { ...state, updateInProgress: false, error: '' };

    case MEDICAL_UPDATE_FAIL:
      return { ...state, updateInProgress: false, error: action.payload  };

    case MEDICAL_FETCH_START:
      return { ...state, fetchInProgress: true };

    case MEDICAL_FETCH_SUCCESS:
      if (!action.payload)
        return { ...state, fetchInProgress: false, medicals: [] };
      else {
        return { ...state, fetchInProgress: false, medicals: action.payload };
      }

    case MEDICAL_FETCH_FAIL:
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

const keys = Object.keys(medicalTypes);

const medicalItem0 = {
  curTime: d0,
  date: d0,
  type: keys[0]
};

const medicalItem1 = {
  curTime: d1,
  date: d1,
  type: keys[1]
};

const medicalItem2 = {
  curTime: d2,
  date: d2,
  type: keys[2]
};

const medicalItem3 = {
  curTime: d3,
  date: d3,
  type: keys[3]
};

const medicalItem4 = {
  curTime: d4,
  date: d4,
  type: keys[4]
};

const medicalItem5 = {
  curTime: d5,
  date: d5,
  type: keys[4]
};
*/

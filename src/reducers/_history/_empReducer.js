import { EMP_FETCH_SUCCESS } from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EMP_FETCH_SUCCESS:
      return action.payload;

    default:
      return state;
  }
};

import { EMP_UPDATE, EMP_UPDATE_DONE, EMP_CREATE_DONE } from '../actions/types';

const INITIAL_STATE = {
  name: "",
  phone: "",
  shift: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EMP_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };

    case EMP_CREATE_DONE:
      return INITIAL_STATE;

    case EMP_UPDATE_DONE:
      return INITIAL_STATE;

    default:
    return state;
  }
};

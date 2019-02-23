import * as actions from '../actions/types';

const INITIAL_STATE = {
  fbToken: null,
  fbUser: null,
  fbExpires: 0
};

export default function FacebookAuthReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.FACEBOOK_LOGIN_SUCCESS:
      {
        const { fbToken, fbUser, fbExpires } = action.payload;
        return { fbToken, fbUser, fbExpires };
      }

    case actions.FACEBOOK_LOGIN_FAIL:
      return INITIAL_STATE;

    case actions.SIGN_OUT_ALL:
      return INITIAL_STATE;

    default:
      return state;
  }
}

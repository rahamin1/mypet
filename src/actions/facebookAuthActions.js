import { Facebook } from 'expo';

import * as actions from '../actions/types';
import { FACEBOOK_APPID } from '../constants/auth';

// How to use AsyncStorage:
//   AsyncStorage.setItem('fb-token', token);
//   AsyncStorage.getItem('fb-token');
//   AsyncStorage.removeItem('fb-token')

export const facebookLogin = () => {
  return async(dispatch) => {
    dispatch({ type: actions.FACEBOOK_LOGIN_START });
    // Calling Facebook login with the facebook app id and
    let { type, token, expires } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APPID, {
      permissions: ['public_profile']
    });

    if (type === 'cancel') { // login failed
      return dispatch({ type: actions.FACEBOOK_LOGIN_FAIL });
    } else {
      try {
        // expires is the time at which this token will expire, as seconds since epoch
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`);
        const name = (await response.json()).name;
        const payload = { fbToken: token, fbUser: name, fbExpires: expires };
        return dispatch({ type: actions.FACEBOOK_LOGIN_SUCCESS, payload });
      } catch (error) {
        // Error saving data
        return dispatch({ type: actions.FACEBOOK_LOGIN_FAIL });
      }
    }
  };
};

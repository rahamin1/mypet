import { AsyncStorage } from 'react-native';
import { Facebook } from 'expo';

import * as actions from '../actions/types';

// How to use AsyncStorage:
//   AsyncStorage.setItem('fb-token', token);
//   AsyncStorage.getItem('fb-token');
//   AsyncStorage.removeItem('fb-token')

// see below possible refactoring
export const facebookLogin = () => {
  return async(dispatch) => {
    await AsyncStorage.removeItem('fb-token');
    let token = await AsyncStorage.getItem('fb-token');
    console.warn(`fb1 token: ${token}`);
    if (token) {
      // Dispatch an action saying FB login is done
      dispatch({ type: actions.FACEBOOK_LOGIN_SUCCESS, payload: token });
    } else {
      // Start fb login process
      doFacebookLogin(dispatch);
    }
  };
};

const doFacebookLogin = async(dispatch) => {
  // Calling Facebook login with the facebook app id and
  let { type, token, expires } = await Facebook.logInWithReadPermissionsAsync('2233309010031765', {
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
      console.warn(`FB user name: ${name}`);

      await AsyncStorage.setItem('fb-token', token);
      console.warn(`fb4 success:`);
      return dispatch({ type: actions.FACEBOOK_LOGIN_SUCCESS, payload });
    } catch (error) {
      // Error saving data
      return dispatch({ type: actions.FACEBOOK_LOGIN_FAIL });
    }
  }
};

/*
Can also write:
  export const facebookLogin = () => async(dispatch) => {
    let token = await AsyncStorage.getItem('fb-token');
    if (token) {
      // Dispatch an action saying FB login is done
    } else {
      // Start fb login process
    }
  };
*/

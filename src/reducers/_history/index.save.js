import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
// import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';

const config = {
  key: 'root',
  storage
};

export default persistCombineReducers(config, {
  auth: AuthReducer
});

/*
export default combineReducers({
  auth: AuthReducer
});
*/

// import { persistCombineReducers } from 'redux-persist';
// import storage from 'redux-persist/es/storage';
import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import PetReducer from './PetReducer';
import MedicalReducer from './MedicalReducer';
import PhotoReducer from './PhotoReducer';
import ContactReducer from './ContactReducer';

export default combineReducers({
  auth: AuthReducer,
  pet: PetReducer,
  medical: MedicalReducer,
  photo: PhotoReducer,
  contact: ContactReducer
});

/*
const config = {
  key: 'root',
  storage
};

export default persistCombineReducers(config, {
  auth: AuthReducer
});
*/

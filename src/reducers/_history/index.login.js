import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import EmpReducer from './EmpReducer';
import EmpFormReducer from './EmpFormReducer';

export default combineReducers({
  auth: AuthReducer,
  empForm: EmpFormReducer,
  emps: EmpReducer
});

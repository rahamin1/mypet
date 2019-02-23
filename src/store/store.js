import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from '../reducers';

let middlewares = [reduxThunk];

const persistConfig = {
 key: 'root',
 storage: storage,
 //timeout: 0, // The code base checks for falsy, so 0 disables
 blacklist: ['medical', 'photo', 'contact', 'pet'],
 whitelist: ['auth']
};

const pReducer = persistReducer(persistConfig, reducers);

//if (__DEV__ === true) {
const temp = false;
if (temp) {
  const mylogger = createLogger({
    predicate: (getState, action) => !action.type.endsWith('_ENDED')
  });
  middlewares.push(mylogger);
}

export default createStore(pReducer,
  applyMiddleware(...middlewares)
);

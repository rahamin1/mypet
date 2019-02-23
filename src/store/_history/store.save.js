import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from 'mypet/reducers';

let middlewares = [reduxThunk];

if (__DEV__ === true) {
  const logger = createLogger({
    predicate: (getState, action) => !action.type.endsWith('_ENDED')
  });
  middlewares.push(logger);
}

export default createStore(reducers,
  applyMiddleware(...middlewares)
);

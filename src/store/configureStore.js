import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { initialize, addTranslation } from 'react-localize-redux';

import createRootReducer from './reducers';
import errorHandler from '../utils/errorHandler';
import actionsReporter from '../utils/actionsReporter';
// import logger from '../utils/logger';
import translations from '../assets/translations.locale.json';

/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
/* eslint-enable */

export default function configureStore(history, initialState = {}) {
  const store = createStore(
    createRootReducer(history),
    initialState,
    composeEnhancers(
      applyMiddleware(
        errorHandler,
        routerMiddleware(history),
        actionsReporter,
        // logger,
        thunk,
      ),
    ),
  );
  // console.log(initialState, store);
  const languages = ['ee', 'gb'];
  store.dispatch(initialize(languages, { defaultLanguage: 'ee' }));
  store.dispatch(addTranslation(translations));
  return store;
}

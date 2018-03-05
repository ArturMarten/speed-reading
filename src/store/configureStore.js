
import { createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { initialize, addTranslation } from 'react-localize-redux';

import rootReducer from './reducers';
// import logger from '../utils/logger';
import * as translations from '../assets/translations.locale.json';

// eslint-disable-next-line no-underscore-dangle
const composeStoreEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

export default function configureStore(history) {
  const store = createStore(
    connectRouter(history)(rootReducer),
    composeStoreEnhancers(applyMiddleware(
      routerMiddleware(history),
      // logger,
      thunk,
    )),
  );
  const languages = ['ee', 'gb'];
  store.dispatch(initialize(languages, { defaultLanguage: 'ee' }));
  store.dispatch(addTranslation(translations));
  return store;
}

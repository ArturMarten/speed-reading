
import {createStore, applyMiddleware, compose} from 'redux';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import logger from '../utils/logger';

import {initialize, addTranslation} from 'react-localize-redux';
import * as translations from '../assets/translations.locale.json';

const composeStoreEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(history) {  
  const store = createStore(
    connectRouter(history)(rootReducer),
    composeStoreEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        logger,
        thunk
      )
    )
  );
  const languages = ['ee', 'gb'];
  store.dispatch(initialize(languages, {defaultLanguage: 'ee'}));
  store.dispatch(addTranslation(translations));
  return store;
}
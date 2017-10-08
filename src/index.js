import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {createBrowserHistory} from 'history';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import { initialize, addTranslation } from 'react-localize-redux';

import reducer from './reducers';
import App from './components/App';
import * as translations from './assets/translations.locale.json';

const composeStoreEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = createBrowserHistory({basename: '/~arturmar'});

let store = createStore(
  connectRouter(history)(reducer),
  composeStoreEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      thunk
    )
  )
);

const languages = ['ee', 'gb'];
store.dispatch(initialize(languages, { defaultLanguage: 'gb' }));
store.dispatch(addTranslation(translations));

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root')
);
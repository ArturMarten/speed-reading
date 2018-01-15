import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {createMemoryHistory} from 'history';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {initialize, addTranslation} from 'react-localize-redux';

import reducer from './reducers';
import App from './components/App';
import * as translations from './assets/translations.locale.json';

const composeStoreEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const memoryHistory = createMemoryHistory({
  basename: '/~arturmar/'
});

let store = createStore(
  connectRouter(memoryHistory)(reducer),
  composeStoreEnhancers(
    applyMiddleware(
      routerMiddleware(memoryHistory),
      thunk
    )
  )
);

const languages = ['ee', 'gb'];
store.dispatch(initialize(languages, {defaultLanguage: 'ee'}));
store.dispatch(addTranslation(translations));

ReactDOM.render(
  <Provider store={store}>
    <App history={memoryHistory} />
  </Provider>,
  document.getElementById('root')
);

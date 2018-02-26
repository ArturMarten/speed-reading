import 'raf/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createMemoryHistory} from 'history';
import {ConnectedRouter} from 'connected-react-router';
import registerServiceWorker from './registerServiceWorker';

import 'semantic-ui-css/semantic.min.css';

import configureStore from './store/configureStore';
import App from './App';

const history = createMemoryHistory({
  basename: '/~arturmar/'
});

let store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();

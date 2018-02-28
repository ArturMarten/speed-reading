import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import 'semantic-ui-css/semantic.min.css';

import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import App from './App';

const history = createMemoryHistory({
  basename: '/~arturmar/',
});

const store = configureStore(history);

ReactDOM.render(
  React.createElement(
    Provider, { store },
    React.createElement(
      ConnectedRouter, { history },
      React.createElement(App),
    ),
  ),
  document.getElementById('root'),
);

registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';

// Styles
/*
import 'semantic-ui-css/semantic.css';
*/
import 'semantic-ui-css/components/site.css';
import 'semantic-ui-css/components/reset.css';
import 'semantic-ui-css/components/transition.css';
import 'semantic-ui-css/components/table.css';
import 'semantic-ui-css/components/menu.css';
import 'semantic-ui-css/components/sidebar.css';
import 'semantic-ui-css/components/modal.css';
import 'semantic-ui-css/components/container.css';
import 'semantic-ui-css/components/grid.css';
import 'semantic-ui-css/components/form.css';
import 'semantic-ui-css/components/flag.css';
import 'semantic-ui-css/components/checkbox.css';
import 'semantic-ui-css/components/header.css';
import 'semantic-ui-css/components/divider.css';
import 'semantic-ui-css/components/image.css';
import 'semantic-ui-css/components/message.css';
import 'semantic-ui-css/components/statistic.css';
import 'semantic-ui-css/components/icon.css';
import 'semantic-ui-css/components/button.css';
import 'semantic-ui-css/components/input.css';
import 'semantic-ui-css/components/label.css';
import 'semantic-ui-css/components/popup.css';
import 'semantic-ui-css/components/rating.css';
import 'semantic-ui-css/components/list.css';
import 'semantic-ui-css/components/search.css';
import 'semantic-ui-css/components/dimmer.css';
import 'semantic-ui-css/components/loader.css';
import 'semantic-ui-css/components/dropdown.css';
import 'semantic-ui-css/components/segment.css';

// Polyfills
import './polyfill';

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

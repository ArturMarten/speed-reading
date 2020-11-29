import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import ReactGA from 'react-ga';
import { getTranslate } from 'react-localize-redux';
import * as Sentry from '@sentry/browser';

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
import 'semantic-ui-css/components/embed.css';
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

// Override global styling
import './index.css';

// Polyfills
import './polyfill';

import * as serviceWorker from './serviceWorker';
import configureStore from './store/configureStore';
import App from './App';
import UpdateMessage from './containers/Message/UpdateMessage';
import OfflineMessage from './containers/Message/OfflineMessage';

const history = createMemoryHistory({
  basename: '/~arturmar/',
});

// Google Analytics
if (process.env.NODE_ENV !== 'development') {
  ReactGA.initialize('UA-129049943-1');
  ReactGA.pageview('/');
  history.listen((location) => ReactGA.pageview(location.pathname));
}

const store = configureStore(history);

// Sentry
Sentry.init({
  dsn: 'https://b356121aa6694ff7bc836d0c077546b7@sentry.io/1793193',
  enabled: process.env.NODE_ENV === 'production',
});

ReactDOM.render(
  React.createElement(Provider, { store }, React.createElement(ConnectedRouter, { history }, React.createElement(App))),
  document.getElementById('root'),
);

serviceWorker.register({
  onOffline: () => {
    const offlineMessage = document.createElement('div');
    offlineMessage.id = 'offline-message';
    const root = document.getElementById('root');
    root.insertBefore(offlineMessage, root.firstChild);
    ReactDOM.render(
      React.createElement(OfflineMessage, {
        translate: getTranslate(store.getState().locale),
      }),
      document.getElementById(offlineMessage.id),
    );
  },
  onUpdate: (registration) => {
    ReactGA.event({
      category: 'Service worker',
      action: 'Installed an update',
    });

    const onUpdateHandler = () => {
      if (!registration.waiting) {
        // Just to ensure registration.waiting is available before calling postMessage()
        return;
      }
      ReactGA.event({
        category: 'User',
        action: 'Applied installed update',
      });
      registration.waiting.postMessage('skipWaiting');
    };

    const updateMessage = document.createElement('div');
    updateMessage.id = 'update-message';
    const root = document.getElementById('root');
    root.insertBefore(updateMessage, root.firstChild);
    ReactDOM.render(
      React.createElement(UpdateMessage, {
        translate: getTranslate(store.getState().locale),
        onUpdate: onUpdateHandler,
      }),
      document.getElementById(updateMessage.id),
    );
  },
});

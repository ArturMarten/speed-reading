import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import {createMemoryHistory} from 'history';
import configureStore from '../store/configureStore';
import {ConnectedRouter} from 'connected-react-router';

const history = createMemoryHistory();

const store = configureStore(history, {});

export default function Provider({ story }) {
  return (
    <ReduxProvider store={store}>
      <ConnectedRouter history={history}>
        {story}
      </ConnectedRouter>
    </ReduxProvider>
  );
};
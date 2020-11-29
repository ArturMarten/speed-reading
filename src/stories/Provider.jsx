import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import configureStore from '../store/configureStore';

const history = createMemoryHistory();

export const store = configureStore(history, {});

export default function Provider({ story }) {
  return (
    <ReduxProvider store={store}>
      <ConnectedRouter history={history}>{story}</ConnectedRouter>
    </ReduxProvider>
  );
}

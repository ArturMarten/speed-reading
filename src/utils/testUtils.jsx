import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { render } from 'react-testing-library';
import { getTranslate } from 'react-localize-redux';
import configureStore from '../store/configureStore';

export default function renderWithRedux(
  ui,
  {
    initialState,
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    store = configureStore(history, initialState),
  } = {},
) {
  const rendered = render(
    <Provider store={store}>
      <ConnectedRouter history={history}>{ui}</ConnectedRouter>
    </Provider>,
  );
  return {
    ...rendered,
    rerender: (newUi) => {
      render(
        <Provider store={store}>
          <ConnectedRouter history={history}>{newUi}</ConnectedRouter>
        </Provider>,
        {
          container: rendered.container,
          baseElement: rendered.baseElement,
        },
      );
    },
    history,
    store,
    translate: getTranslate(store.getState().locale),
  };
}

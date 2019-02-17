import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { render } from 'react-testing-library';
import { getTranslate } from 'react-localize-redux';
import configureStore from '../store/configureStore';

export default function renderWithRedux(
  ui,
  { initialState, store = configureStore(createMemoryHistory(), initialState) } = {},
) {
  const rendered = render(<Provider store={store}>{ui}</Provider>);
  return {
    ...rendered,
    rerender: (newUi) => {
      render(<Provider store={store}>{newUi}</Provider>, {
        container: rendered.container,
        baseElement: rendered.baseElement,
      });
    },
    store,
    translate: getTranslate(store.getState().locale),
  };
}

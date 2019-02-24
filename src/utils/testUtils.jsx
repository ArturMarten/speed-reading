import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { render } from 'react-testing-library';
import { getTranslate } from 'react-localize-redux';
import configureStore from '../store/configureStore';
import { updateObject } from '../shared/utility';

const addTranslateProp = (component, translate) =>
  updateObject(component, { props: updateObject(component.props, { translate }) });

export default function renderWithRedux(
  inputComponent,
  {
    initialState,
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    store = configureStore(history, initialState),
    useTranslate = false,
  } = {},
) {
  const translate = getTranslate(store.getState().locale);
  const outputComponent = useTranslate ? addTranslateProp(inputComponent, translate) : inputComponent;
  const rendered = render(
    <Provider store={store}>
      <ConnectedRouter history={history}>{outputComponent}</ConnectedRouter>
    </Provider>,
  );
  return {
    ...rendered,
    rerender: (newInputComponent) => {
      const newOutputComponent = useTranslate ? addTranslateProp(newInputComponent, translate) : newInputComponent;
      render(
        <Provider store={store}>
          <ConnectedRouter history={history}>{newOutputComponent}</ConnectedRouter>
        </Provider>,
        {
          container: rendered.container,
          baseElement: rendered.baseElement,
        },
      );
    },
    history,
    store,
    translate,
  };
}

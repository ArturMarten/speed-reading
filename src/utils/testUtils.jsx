import { render } from '@testing-library/react';
import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import React from 'react';
import { getTranslate } from 'react-localize-redux';
import { Provider } from 'react-redux';
import { updateObject } from '../shared/utility';
import configureStore from '../store/configureStore';
import { initialState as authInitialState } from '../store/reducers/auth';
import { initialState as profileInitialState } from '../store/reducers/profile';

const addTranslateProp = (component, translate) =>
  updateObject(component, { props: updateObject(component.props, { translate }) });

export default function renderWithRedux(
  inputComponent,
  {
    role = 'student',
    token = null,
    groupId = null,
    initialState = {
      auth: { ...authInitialState, token },
      profile: { ...profileInitialState, role, groupId },
    },
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

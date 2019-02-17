import React from 'react';
import { fireEvent } from 'react-testing-library';
import renderWithRedux from '../../utils/testUtils';

import Layout from './Layout';

it('opens and closes login modal', () => {
  const { translate, queryByText, baseElement } = renderWithRedux(<Layout />);
  expect(queryByText(translate('auth.login-modal-header'))).toBeNull();
  fireEvent.click(queryByText(translate('menu.login-popup')));
  expect(queryByText(translate('auth.login-modal-header'))).not.toBeNull();
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(queryByText(translate('auth.login-modal-header'))).toBeNull();
});

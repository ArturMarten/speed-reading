import React from 'react';
import renderWithRedux from '../../utils/testUtils';

import Logout from './Logout';

test('redirects to root', () => {
  const { history } = renderWithRedux(<Logout />, { route: '/statistics' });
  expect(history.location.pathname).toEqual('/');
});

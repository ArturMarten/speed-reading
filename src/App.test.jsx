import React from 'react';
import renderWithRedux from './utils/testUtils';

import App from './App';

test('App renders', () => {
  renderWithRedux(<App />);
});

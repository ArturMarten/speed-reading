import React from 'react';
import renderWithRedux from './utils/testUtils';

import App from './App';

it('renders', () => {
  renderWithRedux(<App />);
});

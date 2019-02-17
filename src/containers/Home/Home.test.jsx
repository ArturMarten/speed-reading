import React from 'react';
import { fireEvent } from 'react-testing-library';
import renderWithRedux from '../../utils/testUtils';

import Home from './Home';

it('opens user manual', () => {
  const { translate, getByText } = renderWithRedux(<Home />);
  expect(getByText(translate('home.user-manual')).getAttribute('href')).not.toBeNull();
});

it('shows about modal', () => {
  const { translate, getByText, queryByText } = renderWithRedux(<Home />);
  fireEvent.click(getByText(translate('home.about')));
  expect(queryByText(translate('about.modal-header'))).not.toBeNull();
});

it('renders three logos', () => {
  const { getAllByAltText } = renderWithRedux(<Home />);
  expect(getAllByAltText(/logo/i).length).toEqual(3);
});

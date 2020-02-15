import { fireEvent } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import Home from './Home';

it('opens user manual', () => {
  const { translate, getByText } = renderWithRedux(<Home />);
  expect(getByText(translate('home.user-manual')).getAttribute('href')).not.toBeNull();
});

it('shows about modal', () => {
  const { translate, getByText, queryAllByText } = renderWithRedux(<Home />);
  fireEvent.click(getByText(translate('home.about')));
  expect(queryAllByText(translate('about.modal-header'))).toHaveLength(2);
});

it('renders three logos', () => {
  const { getAllByAltText } = renderWithRedux(<Home />);
  expect(getAllByAltText(/logo/i).length).toEqual(3);
});

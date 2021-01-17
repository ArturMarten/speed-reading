import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import Home from './Home';

test('shows information', () => {
  const { translate } = renderWithRedux(<Home />);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('home.title'));

  const segments = screen.getAllByRole('heading', { level: 3 });
  expect(segments[0]).toHaveTextContent(translate('features.header'));
  expect(segments[1]).toHaveTextContent(translate('release-notes.header'));
  expect(segments[2]).toHaveTextContent(translate('intro-video.header'));
  expect(segments[3]).toHaveTextContent(translate('application-statistics.state'));
});

test('opens user manual', () => {
  const { translate } = renderWithRedux(<Home />);
  expect(screen.getByText(translate('home.user-manual')).getAttribute('href')).not.toBeNull();
});

test('shows about modal', () => {
  const { translate } = renderWithRedux(<Home />);
  fireEvent.click(screen.getByText(translate('home.about')));
  expect(screen.queryAllByText(translate('about.modal-header'))).toHaveLength(2);
});

test('renders three logos', () => {
  renderWithRedux(<Home />);
  expect(screen.getAllByAltText(/logo/i).length).toEqual(3);
});

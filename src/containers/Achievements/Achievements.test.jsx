import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRedux from '../../utils/testUtils';
import Achievements from './Achievements';

test('shows achievements', async () => {
  const { translate } = renderWithRedux(<Achievements />);

  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('achievements.title'));

  const segments = screen.getAllByRole('heading', { level: 3 });
  expect(segments[0]).toHaveTextContent(translate('achievements.daily'));
  expect(segments[1]).toHaveTextContent(translate('achievements.weekly'));
  expect(segments[2]).toHaveTextContent(translate('achievements.monthly'));
  expect(segments[3]).toHaveTextContent(translate('achievements.progress'));

  expect(screen.queryByLabelText(translate('statistics.group'))).not.toBeInTheDocument();
  expect(screen.queryByLabelText(translate('statistics.user'))).not.toBeInTheDocument();
});

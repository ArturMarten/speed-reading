import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import Layout from './Layout';

test('opens and closes login modal', () => {
  const { translate, baseElement } = renderWithRedux(<Layout />);
  expect(screen.queryByText(translate('auth.login-modal-header'))).toBeNull();
  fireEvent.click(screen.queryByText(translate('menu.login-popup')));
  expect(screen.queryByText(translate('auth.login-modal-header'))).not.toBeNull();
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(screen.queryByText(translate('auth.login-modal-header'))).toBeNull();
});

test('opens and closes feedback modal', () => {
  const { translate, baseElement } = renderWithRedux(<Layout />);
  expect(screen.queryByText(translate('feedback.modal-header'))).toBeNull();
  fireEvent.click(baseElement.querySelector('i.talk'));
  expect(screen.queryAllByText(translate('feedback.modal-header'))).toHaveLength(2);
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(screen.queryByText(translate('feedback.modal-header'))).toBeNull();
});

test('opens and closes problem report modal', async () => {
  const { translate, baseElement } = renderWithRedux(<Layout />);
  expect(screen.queryByText(translate('problem-report.modal-header'))).toBeNull();
  fireEvent.click(baseElement.querySelector('i.triangle'));
  await waitFor(() => screen.getByText(translate('problem-report.modal-header')));
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(screen.queryByText(translate('problem-report.modal-header'))).toBeNull();
});

test('opens and closes bug report modal', async () => {
  const { translate, baseElement } = renderWithRedux(<Layout />);
  expect(screen.queryByText(translate('bug-report.modal-header'))).toBeNull();
  fireEvent.click(baseElement.querySelector('i.bug'));
  await waitFor(() => screen.getByText(translate('bug-report.modal-header')));
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(screen.queryByText(translate('bug-report.modal-header'))).toBeNull();
});

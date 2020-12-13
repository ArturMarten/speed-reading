import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
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

it('opens and closes feedback modal', () => {
  const { translate, queryByText, queryAllByText, baseElement } = renderWithRedux(<Layout />);
  expect(queryByText(translate('feedback.modal-header'))).toBeNull();
  fireEvent.click(baseElement.querySelector('i.talk'));
  expect(queryAllByText(translate('feedback.modal-header'))).toHaveLength(2);
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(queryByText(translate('feedback.modal-header'))).toBeNull();
});

it('opens and closes problem report modal', async () => {
  const { translate, queryByText, getByText, baseElement } = renderWithRedux(<Layout />);
  expect(queryByText(translate('problem-report.modal-header'))).toBeNull();
  fireEvent.click(baseElement.querySelector('i.triangle'));
  await waitFor(() => getByText(translate('problem-report.modal-header')));
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(queryByText(translate('problem-report.modal-header'))).toBeNull();
});

it('opens and closes bug report modal', async () => {
  const { translate, queryByText, getByText, baseElement } = renderWithRedux(<Layout />);
  expect(queryByText(translate('bug-report.modal-header'))).toBeNull();
  fireEvent.click(baseElement.querySelector('i.bug'));
  await waitFor(() => getByText(translate('bug-report.modal-header')));
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(queryByText(translate('bug-report.modal-header'))).toBeNull();
});

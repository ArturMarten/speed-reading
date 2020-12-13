import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import Auth from './Auth';

test('registers successfully', async () => {
  const { translate, getByText, getByPlaceholderText, queryByText } = renderWithRedux(<Auth />);
  fireEvent.click(getByText(translate('auth.create-button')));
  fireEvent.change(getByPlaceholderText(translate('auth.email')), { target: { value: 'username@test.com' } });
  fireEvent.change(getByPlaceholderText(translate('auth.confirm-email')), { target: { value: 'username@test.com' } });
  fireEvent.click(getByText(translate('auth.register-user')));
  await waitFor(() => expect(queryByText(translate('success.account-registered-password-sent'))).not.toBeNull());
});

test('logins successfully', async () => {
  const { translate, getByPlaceholderText, getByText, queryByText } = renderWithRedux(<Auth />);
  fireEvent.change(getByPlaceholderText(translate('auth.username')), { target: { value: 'username@test.com' } });
  fireEvent.change(getByPlaceholderText(translate('auth.password')), { target: { value: 'password' } });
  fireEvent.click(getByText(translate('auth.login-button')));
  await waitFor(() => expect(queryByText(translate('auth.login-button'))).toBeNull());
});

test('shows error when user does not exist', async () => {
  const { translate, getByPlaceholderText, getByText, queryByText } = renderWithRedux(<Auth />);
  fireEvent.change(getByPlaceholderText(translate('auth.username')), { target: { value: 'unknown@test.com' } });
  fireEvent.change(getByPlaceholderText(translate('auth.password')), { target: { value: 'password' } });
  fireEvent.click(getByText(translate('auth.login-button')));
  await waitFor(() => expect(queryByText(translate('error.user-not-found'))).not.toBeNull());
});

test('shows error with incorrect password', async () => {
  const { translate, getByPlaceholderText, getByText, queryByText } = renderWithRedux(<Auth />);
  fireEvent.change(getByPlaceholderText(translate('auth.username')), { target: { value: 'username@test.com' } });
  fireEvent.change(getByPlaceholderText(translate('auth.password')), { target: { value: 'wrong_password' } });
  fireEvent.click(getByText(translate('auth.login-button')));
  await waitFor(() => expect(queryByText(translate('error.incorrect-password'))).not.toBeNull());
});

test('logins successfully with demo user', async () => {
  const { translate, getByText, queryByText } = renderWithRedux(<Auth />);
  fireEvent.click(getByText(translate('auth.demo')));
  await waitFor(() => expect(queryByText(translate('auth.login-button'))).toBeNull());
});

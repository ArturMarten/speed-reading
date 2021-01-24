import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import Auth from './Auth';

test('registers successfully', async () => {
  const { translate } = renderWithRedux(<Auth />);
  fireEvent.click(screen.getByText(translate('auth.create-button')));
  fireEvent.change(screen.getByPlaceholderText(translate('auth.email')), { target: { value: 'username@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(translate('auth.confirm-email')), {
    target: { value: 'username@test.com' },
  });
  fireEvent.click(screen.getByText(translate('auth.register-user')));
  await waitFor(() =>
    expect(screen.queryByText(translate('success.account-registered-password-sent'))).toBeInTheDocument(),
  );
});

test('logins successfully', async () => {
  const { translate } = renderWithRedux(<Auth />);
  fireEvent.change(screen.getByPlaceholderText(translate('auth.username')), { target: { value: 'username@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(translate('auth.password')), { target: { value: 'password' } });
  fireEvent.click(screen.getByText(translate('auth.login-button')));
  await waitFor(() => expect(screen.queryByText(translate('auth.login-button'))).not.toBeInTheDocument());
});

test('shows error when user does not exist', async () => {
  const { translate } = renderWithRedux(<Auth />);
  fireEvent.change(screen.getByPlaceholderText(translate('auth.username')), { target: { value: 'unknown@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(translate('auth.password')), { target: { value: 'password' } });
  fireEvent.click(screen.getByText(translate('auth.login-button')));
  await waitFor(() => expect(screen.queryByText(translate('error.user-not-found'))).toBeInTheDocument());
});

test('shows error with incorrect password', async () => {
  const { translate } = renderWithRedux(<Auth />);
  fireEvent.change(screen.getByPlaceholderText(translate('auth.username')), { target: { value: 'username@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(translate('auth.password')), { target: { value: 'wrong_password' } });
  fireEvent.click(screen.getByText(translate('auth.login-button')));
  await waitFor(() => expect(screen.queryByText(translate('error.incorrect-password'))).toBeInTheDocument());
});

test('logins successfully with demo user', async () => {
  const { translate } = renderWithRedux(<Auth />);
  fireEvent.click(screen.getByText(translate('auth.demo')));
  await waitFor(() => expect(screen.queryByText(translate('auth.login-button'))).not.toBeInTheDocument());
});

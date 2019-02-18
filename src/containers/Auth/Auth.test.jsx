import React from 'react';
import { fireEvent, wait } from 'react-testing-library';
import axiosMock from 'axios';
import renderWithRedux from '../../utils/testUtils';

import Auth from './Auth';
import credentials from '../../credentials';

it('registers successfully', async () => {
  axiosMock.get.mockResolvedValueOnce({
    data: [{ id: 1, name: 'Group 1' }],
  });
  axiosMock.post.mockResolvedValueOnce({
    data: {
      message: 'Account registered, password sent with email',
    },
  });
  const { translate, getByText, getByPlaceholderText, queryByText, debug } = renderWithRedux(<Auth />);
  fireEvent.click(getByText(translate('auth.create-button')));
  expect(axiosMock.get).toBeCalledTimes(1);
  expect(axiosMock.get).toBeCalledWith('/groups');
  fireEvent.change(getByPlaceholderText(translate('auth.email')), { target: { value: 'username@test.com' } });
  fireEvent.change(getByPlaceholderText(translate('auth.confirm-email')), { target: { value: 'username@test.com' } });
  fireEvent.click(getByText(translate('auth.register-user')));
  await wait(() => expect(queryByText(translate('success.account-registered-password-sent'))).not.toBeNull());
  expect(axiosMock.post).toBeCalledTimes(1);
  expect(axiosMock.post).toBeCalledWith(
    '/register',
    expect.objectContaining({
      email: 'username@test.com',
      groupId: null,
    }),
  );
});

it('logins successfully', async () => {
  const USER_ID = '3d51a50e-cf70-4ee1-a6ea-39d14de246e5';
  axiosMock.get
    .mockResolvedValueOnce({
      data: {
        expiresIn: 21600,
        token: 'token',
        userId: USER_ID,
      },
    })
    .mockResolvedValueOnce({
      data: {
        email: 'username@test.com',
        firstName: 'user',
        groupId: null,
        lastLogin: 'Tue, 01 Feb 2019 00:00:00 GMT',
        lastName: 'name',
        publicId: USER_ID,
        registrationDate: 'Tue, 01 Feb 2019 00:00:00 GMT',
        role: 'student',
        settings: null,
      },
    });
  const { translate, getByPlaceholderText, getByText, queryByText } = renderWithRedux(<Auth />);
  fireEvent.change(getByPlaceholderText(translate('auth.username')), { target: { value: 'username@test.com' } });
  fireEvent.change(getByPlaceholderText(translate('auth.password')), { target: { value: 'password' } });
  fireEvent.click(getByText(translate('auth.login-button')));
  await wait(() => expect(queryByText(translate('auth.login-button'))).toBeNull());
  expect(axiosMock.get).toHaveBeenCalledTimes(2);
  expect(axiosMock.get).toHaveBeenNthCalledWith(
    1,
    '/login',
    expect.objectContaining({
      auth: {
        username: 'username@test.com',
        password: 'password',
      },
    }),
  );
  expect(axiosMock.get).toHaveBeenNthCalledWith(2, `/users/${USER_ID}`);
});

it('shows error when user does not exist', async () => {
  axiosMock.get.mockRejectedValueOnce({
    response: {
      data: {
        error: 'User cannot be found',
      },
    },
  });
  const { translate, getByPlaceholderText, getByText, queryByText } = renderWithRedux(<Auth />);
  fireEvent.change(getByPlaceholderText(translate('auth.username')), { target: { value: 'username@test.com' } });
  fireEvent.change(getByPlaceholderText(translate('auth.password')), { target: { value: 'password' } });
  fireEvent.click(getByText(translate('auth.login-button')));
  await wait(() => expect(queryByText(translate('error.user-not-found'))).not.toBeNull());
});

it('shows error when incorrect password', async () => {
  axiosMock.get.mockRejectedValueOnce({
    response: {
      data: {
        error: 'Incorrect password',
      },
    },
  });
  const { translate, getByPlaceholderText, getByText, queryByText } = renderWithRedux(<Auth />);
  fireEvent.change(getByPlaceholderText(translate('auth.username')), { target: { value: 'username@test.com' } });
  fireEvent.change(getByPlaceholderText(translate('auth.password')), { target: { value: 'password' } });
  fireEvent.click(getByText(translate('auth.login-button')));
  await wait(() => expect(queryByText(translate('error.incorrect-password'))).not.toBeNull());
});

it('logins successfully with demo user', async () => {
  axiosMock.get.mockResolvedValue({
    data: {},
  });
  const { translate, getByText, queryByText } = renderWithRedux(<Auth />);
  fireEvent.click(getByText(translate('auth.demo')));
  await wait(() => expect(queryByText(translate('auth.login-button'))).toBeNull());
  expect(axiosMock.get).toBeCalledTimes(2);
  expect(axiosMock.get).toHaveBeenNthCalledWith(
    1,
    '/login',
    expect.objectContaining({
      auth: {
        username: credentials.demo.username,
        password: '',
      },
    }),
  );
});

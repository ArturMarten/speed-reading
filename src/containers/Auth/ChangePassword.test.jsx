import React from 'react';
import { fireEvent, wait } from 'react-testing-library';
import axiosMock from 'axios';
import renderWithRedux from '../../utils/testUtils';

import ChangePassword from './ChangePassword';

it('changes password', async () => {
  axiosMock.get.mockResolvedValueOnce({
    data: {
      message: 'Password changed',
    },
  });
  const { translate, getByText, getByPlaceholderText, queryByText } = renderWithRedux(<ChangePassword open />);
  fireEvent.change(getByPlaceholderText(translate('change-password.old-password')), {
    target: { value: 'oldPassword' },
  });
  fireEvent.change(getByPlaceholderText(translate('change-password.new-password')), {
    target: { value: 'newPassword' },
  });
  fireEvent.change(getByPlaceholderText(translate('change-password.confirm-new-password')), {
    target: { value: 'newPassword' },
  });
  fireEvent.click(getByText(translate('change-password.change')));
  await wait(() => expect(queryByText(translate('success.password-changed'))).not.toBeNull());
  expect(axiosMock.get).toBeCalledTimes(1);
  expect(axiosMock.get).toBeCalledWith(
    '/changePassword',
    expect.objectContaining({
      auth: {
        password: 'oldPassword_newPassword',
      },
    }),
  );
});

import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import ChangePassword from './ChangePassword';
import * as api from '../../api';

it('changes password', async () => {
  api.saveToken('Bearer dXNlcm5hbWVAdGVzdC5jb20=');
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
  await waitFor(() => expect(queryByText(translate('success.password-changed'))).not.toBeNull());
});

import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import ChangePassword from './ChangePassword';
import * as api from '../../api';

test('changes password', async () => {
  api.saveToken('Bearer dXNlcm5hbWVAdGVzdC5jb20=');
  const { translate } = renderWithRedux(<ChangePassword open />);
  fireEvent.change(screen.getByPlaceholderText(translate('change-password.old-password')), {
    target: { value: 'oldPassword' },
  });
  fireEvent.change(screen.getByPlaceholderText(translate('change-password.new-password')), {
    target: { value: 'newPassword' },
  });
  fireEvent.change(screen.getByPlaceholderText(translate('change-password.confirm-new-password')), {
    target: { value: 'newPassword' },
  });
  fireEvent.click(screen.getByText(translate('change-password.change')));
  await waitFor(() => expect(screen.queryByText(translate('success.password-changed'))).not.toBeNull());
});

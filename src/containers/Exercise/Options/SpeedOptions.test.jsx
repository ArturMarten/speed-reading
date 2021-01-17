import React from 'react';
import renderWithRedux from '../../../utils/testUtils';

import SpeedOptions from './SpeedOptions';

test('renders default options', () => {
  renderWithRedux(
    <table>
      <tbody>
        <SpeedOptions />
      </tbody>
    </table>,
  );
});

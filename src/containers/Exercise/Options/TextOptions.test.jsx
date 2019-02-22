import React from 'react';
import renderWithRedux from '../../../utils/testUtils';

import TextOptions from './TextOptions';

it('renders default options', () => {
  renderWithRedux(
    <table>
      <tbody>
        <TextOptions />
      </tbody>
    </table>,
  );
});

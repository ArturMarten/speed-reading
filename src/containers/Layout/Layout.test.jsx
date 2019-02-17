import React from 'react';
import { fireEvent } from 'react-testing-library';
import renderWithRedux from '../../utils/testUtils';

import Layout from './Layout';

it('temp', () => {
  const { debug } = renderWithRedux(<Layout />);
  /*
  debug();
  expect(baseElement.querySelector('iframe')).toBeNull();
  fireEvent.click(baseElement.querySelector('i.video.play.icon'));
  expect(baseElement.querySelector('iframe')).not.toBeNull();
  */
});

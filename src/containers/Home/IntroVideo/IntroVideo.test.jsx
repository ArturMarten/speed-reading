import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import IntroVideo from './IntroVideo';

it('plays video', () => {
  const { baseElement } = render(<IntroVideo translate={jest.fn()} />);
  expect(baseElement.querySelector('iframe')).toBeNull();
  fireEvent.click(baseElement.querySelector('i.video.play.icon'));
  expect(baseElement.querySelector('iframe')).not.toBeNull();
});

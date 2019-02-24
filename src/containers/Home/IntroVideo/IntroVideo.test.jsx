import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import IntroVideo from './IntroVideo';

it('plays video', () => {
  const { container } = render(<IntroVideo translate={jest.fn()} />);
  expect(container.querySelector('iframe')).toBeNull();
  fireEvent.click(container.querySelector('i.video.play.icon'));
  expect(container.querySelector('iframe')).not.toBeNull();
});

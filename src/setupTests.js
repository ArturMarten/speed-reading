import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils'; // ES6

jest.mock('html2canvas', () => () => Promise.resolve({ toDataURL: () => {} }));
jest.mock('');

global.afterEach(() => {
  jest.resetAllMocks();
});

// Jsdom does not support paste event data
fireEvent.paste = jest.fn((element, eventData) => ReactTestUtils.Simulate.paste(element, eventData));

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import renderWithRedux from '../../utils/testUtils';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

afterEach(() => {
  jest.clearAllMocks();
});

const errorText = 'Some error text';

function Throws({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error(errorText);
  } else {
    return null;
  }
}

test('calls onSubmit and renders that there was a problem', () => {
  const userId = '1';
  const onSubmit = jest.fn();
  const { rerender, translate } = renderWithRedux(
    <ErrorBoundary userId={userId} onSubmit={onSubmit}>
      <Throws shouldThrow={false} />
    </ErrorBoundary>,
  );

  rerender(
    <ErrorBoundary userId={userId} onSubmit={onSubmit}>
      <Throws shouldThrow={true} />
    </ErrorBoundary>,
  );

  expect(onSubmit).toHaveBeenCalledWith({
    userId,
    description: expect.any(String),
    version: expect.any(String),
    userAgent: expect.any(String),
    platform: expect.any(String),
    windowDimensions: [1024, 768],
    consoleErrors: [],
    state: expect.any(Object),
    actions: expect.any(Array),
    screenshot: null,
  });
  expect(onSubmit).toHaveBeenCalledTimes(1);

  expect(console.error).toHaveBeenCalledTimes(2);

  expect(screen.getByText(translate('error-popup.modal-header')));
  expect(screen.getByText(errorText));

  console.error.mockClear();
  onSubmit.mockClear();

  rerender(
    <ErrorBoundary userId={userId} onSubmit={onSubmit}>
      <Throws shouldThrow={false} />
    </ErrorBoundary>,
  );

  fireEvent.click(screen.getByText(translate('error-popup.ok')));

  expect(console.error).not.toHaveBeenCalled();
  expect(screen.queryByText(errorText)).not.toBeInTheDocument();
});

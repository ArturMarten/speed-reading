import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { server, apiURL, rest } from '../../test/server';
import renderWithRedux from '../../utils/testUtils';
import ProblemReport from './ProblemReport';

test('opens and closes the modal', () => {
  const onClose = jest.fn();
  const { translate, baseElement, rerender } = renderWithRedux(<ProblemReport open onClose={onClose} />);
  expect(screen.queryByText(translate('problem-report.modal-header'))).not.toBeNull();
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(onClose).toHaveBeenCalledTimes(1);
  rerender(<ProblemReport open={false} />);
  expect(screen.queryByText(translate('problem-report.modal-header'))).toBeNull();
});

test('submits problem report', async () => {
  const { translate } = renderWithRedux(<ProblemReport open />);
  fireEvent.change(screen.getByLabelText(translate('problem-report.textarea-description')), {
    target: { value: 'test' },
  });
  fireEvent.click(screen.getByText(translate('problem-report.send')));
  await waitFor(() => screen.getByText(translate('success.problem-report-added')));
  /*
  expect(submit).toHaveBeenCalledWith('/problemReports', {
    userId: null,
    type: 'text',
    textTitle: null,
    description: 'test',
    screenshot: null,
  });
  */
});

test('shows error', async () => {
  server.use(
    rest.post(`${apiURL}/problemReports`, async (req, res, ctx) => {
      return res(500, ctx.json({ error: 'Network Error' }));
    }),
  );
  const { translate } = renderWithRedux(<ProblemReport open />);
  fireEvent.change(screen.getByLabelText(translate('problem-report.textarea-description')), {
    target: { value: 'test' },
  });
  fireEvent.click(screen.getByText(translate('problem-report.send')));
  await waitFor(() => screen.getByText(translate('error.network-error')));
});

import '@testing-library/jest-dom/extend-expect';
import { server } from './test/server';

process.env.DEBUG_PRINT_LIMIT = 15000;

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

jest.mock('html2canvas', () => () => Promise.resolve({ toDataURL: () => {} }));

global.afterEach(() => {
  jest.resetAllMocks();
});

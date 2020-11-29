import '@testing-library/jest-dom/extend-expect';

jest.mock('html2canvas', () => () => Promise.resolve({ toDataURL: () => {} }));
jest.mock('');

global.afterEach(() => {
  jest.resetAllMocks();
});

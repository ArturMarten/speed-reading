import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';

jest.mock('html2canvas', () => () => Promise.resolve({ toDataURL: () => {} }));

global.afterEach(() => {
  jest.resetAllMocks();
});

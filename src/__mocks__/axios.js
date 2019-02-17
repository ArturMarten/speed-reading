export const axiosMock = {
  get: jest.fn(),
  post: jest.fn(),
  create: jest.fn(() => axiosMock),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
};

export default axiosMock;

import { setupServer } from 'msw/node';
import { handlers, apiURL } from './server-handlers';

const server = setupServer(...handlers);

export * from 'msw';
export { server, apiURL };

import { setupWorker } from 'msw';
import { handlers, apiURL } from '../server/server-handlers';

const worker = setupWorker(...handlers);

export * from 'msw';
export { worker, apiURL };

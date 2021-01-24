import { withConsole } from '@storybook/addon-console';
import { addDecorator } from '@storybook/react';

addDecorator((storyFn, context) => withConsole()(storyFn)(context));

if (typeof global.process === 'undefined') {
  const { worker } = require('../src/test/worker');
  worker.start({ onUnhandledRequest: 'warn' });
}

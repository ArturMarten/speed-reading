import { configure, addDecorator } from '@storybook/react';
import { themes } from '@storybook/components';
import { withOptions } from '@storybook/addon-options';
import centered from '@storybook/addon-centered';
import { withConsole } from '@storybook/addon-console';
import { withKnobs } from '@storybook/addon-knobs';
import { checkA11y } from '@storybook/addon-a11y';
import { withNotes } from '@storybook/addon-notes';

addDecorator(withOptions({
  theme: themes.normal
}));
addDecorator(centered);
addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(withKnobs);
addDecorator(checkA11y);
addDecorator(withNotes);

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);

import { configure, addParameters, addDecorator } from '@storybook/react';
import { themes } from '@storybook/theming';
import centered from '@storybook/addon-centered';
import { withConsole } from '@storybook/addon-console';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { withNotes } from '@storybook/addon-notes';

addParameters({
  options: {
    theme: themes.dark,
  },
});

addDecorator(centered);
addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(withKnobs);
addDecorator(withA11y);
addDecorator(withNotes);

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);

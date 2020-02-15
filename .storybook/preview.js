import { withA11y } from '@storybook/addon-a11y';
import centered from '@storybook/addon-centered/react';
import { withConsole } from '@storybook/addon-console';
import { withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { addDecorator } from '@storybook/react';

addDecorator(centered);
addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(withKnobs);
addDecorator(withA11y);
addDecorator(withNotes);

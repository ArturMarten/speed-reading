import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'dark',
  brandTitle: 'Kiirlugemine',
});

addons.setConfig({
  showRoots: true,
  showPanel: false,
  theme,
});

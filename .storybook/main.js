module.exports = {
  stories: [
    '../src/**/*.stories.[tj]sx',
  ],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-links/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-notes/register',
  ],
};

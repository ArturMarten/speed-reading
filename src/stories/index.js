import React from 'react';
import { storiesOf } from '@storybook/react';
import Provider from './Provider';
import 'semantic-ui-css/semantic.min.css';
import { linkTo } from '@storybook/addon-links';
import Auth from '../containers/Auth/Auth';

import { Welcome } from '@storybook/react/demo';

storiesOf('Welcome', module)
  .add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Login', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('form', () => <Auth />)

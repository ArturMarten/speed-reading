import React from 'react';
import { storiesOf } from '@storybook/react';
import Provider from './Provider';
import 'semantic-ui-css/semantic.min.css';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import LoginContainer from '../containers/auth/LoginContainer';

import { Button, Welcome } from '@storybook/react/demo';

storiesOf('Welcome', module)
  .add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Login', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('form', () => <LoginContainer />)

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

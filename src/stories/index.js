import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import Provider from './Provider';

import Home from '../containers/Home/Home';
import TextEntry from '../containers/TextEntry/TextEntry';
import TextExercisePreparation from '../containers/Exercise/Preparation/TextExercisePreparation';
import TextExerciseTest from '../containers/Exercise/Test/TextExerciseTest';
import Statistics from '../containers/Statistics/Statistics';
import Auth from '../containers/Auth/Auth';
import Feedback from '../containers/Feedback/Feedback';

storiesOf('Home', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('Default', () => <Home />)

storiesOf('Text input', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('Editor', () => <TextEntry />)

storiesOf('Preparation', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('Reading exercise', () => <TextExercisePreparation type='reading' onProceed={action('clicked')} />)

storiesOf('Test', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('Reading test', () => <TextExerciseTest />)

storiesOf('Statistics', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('Chart', () => <Statistics />)

storiesOf('Auth', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('Login', () => <Auth open />)

storiesOf('Feedback', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('Default', () => <Feedback open />)
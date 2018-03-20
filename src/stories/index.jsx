import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { getTranslate } from 'react-localize-redux';

import Provider, { store } from './Provider';

import Home from '../containers/Home/Home';
import TextEntry from '../containers/TextEntry/TextEntry';
import TextEditor from '../containers/TextEditor/TextEditor';
import TextExercisePreparation from '../containers/Exercise/Preparation/TextExercisePreparation';
import TextSelection from '../containers/TextSelection/TextSelection';
import TextExerciseResultsContainer, { TextExerciseResults } from '../containers/Exercise/Container/TextExerciseResults';
import TextTestEditor from '../containers/TextEntry/TextTestEditor/TextTestEditor';
import TextExerciseTest from '../containers/Exercise/Test/TextExerciseTest';
import Statistics from '../containers/Statistics/Statistics';
import Manage from '../containers/Manage/Manage';
import Auth from '../containers/Auth/Auth';
import Feedback from '../containers/Feedback/Feedback';

const translate = getTranslate(store.getState().locale);
addDecorator(story => <Provider story={story()} />);

storiesOf('Home', module)
  .add('Container', () => <Home />);

storiesOf('Text entry', module)
  .add('Container', () => <TextEntry />);

storiesOf('Text editor', module)
  .add('Container', () => <TextEditor />);

storiesOf('Preparation', module)
  .add('Container', () => <TextExercisePreparation type="reading" onProceed={action('clicked')} />);

storiesOf('Text selection', module)
  .add('Container', () => <TextSelection open />);

storiesOf('Text exercise results', module)
  .add('Container', () => <TextExerciseResultsContainer open />)
  .add('Component', () => (
    <TextExerciseResults
      open
      translate={translate}
      results={{ elapsedTime: 224200, wpm: 306, cpm: 2064 }}
    />));

storiesOf('Text test editor', module)
  .add('Container', () => <TextTestEditor open readingTextId={9} />);

storiesOf('Text exercise test', module)
  .add('Container', () => <TextExerciseTest />);

storiesOf('Statistics', module)
  .add('Container', () => <Statistics />);

storiesOf('Manage', module)
  .add('Container', () => <Manage />);

storiesOf('Auth', module)
  .add('Container', () => <Auth open />);

storiesOf('Feedback', module)
  .add('Container', () => <Feedback open loading={false} sent={false} />);
//  .add('Submitted', () => <Feedback open loading sent={false} />)
//  .add('After Submission', () => <Feedback open loading={false} sent />);

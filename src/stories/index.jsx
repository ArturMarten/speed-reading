import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { getTranslate, setActiveLanguage } from 'react-localize-redux';

import Provider, { store } from './Provider';

import HomeContainer from '../containers/Home/Home';
import TextEntryContainer from '../containers/TextEntry/TextEntry';
import TextEditorContainer from '../containers/TextEditor/TextEditor';
import TextExercisePreparationContainer from '../containers/Exercise/Preparation/TextExercisePreparation';
import TextSelectionContainer from '../containers/TextSelection/TextSelection';
import TextPreviewContainer from '../containers/Exercise/Preview/TextPreview';
import TextExerciseResultsContainer, { TextExerciseResults } from '../containers/Exercise/Container/TextExerciseResults';
import TextTestEditorContainer from '../containers/TextEntry/TextTestEditor/TextTestEditor';
import TextExerciseTestContainer from '../containers/Exercise/Test/TextExerciseTest';
import TestResultsContainer, { TestResults } from '../containers/Exercise/Container/TestResults';
import StatisticsContainer from '../containers/Statistics/Statistics';
import ManageContainer from '../containers/Manage/Manage';
import AuthContainer from '../containers/Auth/Auth';
import FeedbackContainer, { Feedback } from '../containers/Feedback/Feedback';

store.dispatch(setActiveLanguage('ee'));
// store.dispatch(setActiveLanguage('gb'));
const translate = getTranslate(store.getState().locale);
addDecorator(story => <Provider story={story()} />);

storiesOf('Home', module)
  .add('Container', () => <HomeContainer />);

storiesOf('Text entry', module)
  .add('Container', () => <TextEntryContainer />);

storiesOf('Text editor', module)
  .add('Container', () => <TextEditorContainer />);

storiesOf('Preparation', module)
  .add('Container', () => <TextExercisePreparationContainer type="reading" onProceed={action('clicked')} />);

storiesOf('Text selection', module)
  .add('Container', () => <TextSelectionContainer open />);

storiesOf('Text preview', module)
  .add('Container', () => <TextPreviewContainer />);

storiesOf('Text exercise results', module)
  .add('Container', () => <TextExerciseResultsContainer open />)
  .add('Component', () => (
    <TextExerciseResults
      open
      translate={translate}
      results={{
        elapsedTime: 224200,
        wpm: 306,
        cps: 35,
      }}
    />));

storiesOf('Text test editor', module)
  .add('Container', () => <TextTestEditorContainer open readingTextId={9} />);

storiesOf('Text exercise test', module)
  .add('Container', () => <TextExerciseTestContainer />);

storiesOf('Test results', module)
  .add('Container', () => <TestResultsContainer open />)
  .add('Component', () => (
    <TestResults
      open
      translate={translate}
      results={{
        elapsedTime: 124200,
        total: 7,
        correct: 5,
        incorrect: 2,
      }}
    />));

storiesOf('Statistics', module)
  .add('Container', () => <StatisticsContainer />);

storiesOf('Manage', module)
  .add('Container', () => <ManageContainer />);

storiesOf('Auth', module)
  .add('Container', () => <AuthContainer open />);

storiesOf('Feedback', module)
  .add('Container', () => <FeedbackContainer open />)
  .add('Component', () => <Feedback open translate={translate} />)
  .add('Component submitting', () => <Feedback open loading sent={false} translate={translate} />)
  .add('Component submitted', () => <Feedback open loading={false} sent translate={translate} />);

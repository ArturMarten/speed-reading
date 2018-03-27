import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { getTranslate, setActiveLanguage } from 'react-localize-redux';

/* eslint-disable max-len */
import * as actionCreators from '../store/actions';
import Provider, { store } from './Provider';

import HomeContainer from '../containers/Home/Home';
import TextEntryContainer from '../containers/TextEntry/TextEntry';
import TextEditorContainer from '../containers/TextEditor/TextEditor';
import TextExercisePreparationContainer from '../containers/Exercise/Preparation/TextExercisePreparation';
import TextSelectionContainer from '../containers/TextSelection/TextSelection';
import TextPreviewContainer from '../containers/Exercise/Preview/TextPreview';
import { TextExercise } from '../containers/Exercise/TextExercise/TextExercise';
import TextExerciseResultsContainer, { TextExerciseResults } from '../containers/Exercise/Container/TextExerciseResults';
import TextTestEditorContainer from '../containers/TextEntry/TextTestEditor/TextTestEditor';
import TextExerciseTestContainer from '../containers/Exercise/Test/TextExerciseTest';
import TestResultsContainer, { TestResults } from '../containers/Exercise/Container/TestResults';
import StatisticsContainer from '../containers/Statistics/Statistics';
import ManageContainer from '../containers/Manage/Manage';
import AuthContainer from '../containers/Auth/Auth';
import FeedbackContainer, { Feedback } from '../containers/Feedback/Feedback';

/*
const dummyData = [
  { id: 1, questionText: 'Mehelikku energiat iseloomustavad ego, sõjad, võistlemine ja............ning läbi aastasadade on seda olnud enam kui küllalt.', answers: [{ id: 1, answerText: 'passiivsus' }, { id: 2, answerText: 'vägivaldsus' }, { id: 3, answerText: 'agressiivsus' }, { id: 4, answerText: 'sõjakus' }] },
  { id: 2, questionText: 'Nende kogukonna organiseeritust on lääne definitsioonide abil keeruline selgitada, kuid kõige enam kasutatakse selle kirjeldamisel sõna........', answers: [{ id: 1, answerText: 'esmaõiguslikkus' }, { id: 2, answerText: 'patriaarhia' }, { id: 3, answerText: 'matriarhaat' }, { id: 4, answerText: 'sugulusjärgus' }] },
  { id: 3, questionText: 'Mosuode ühiskonnas on oluline erinevus, mis teistes ühiskondades on olemas ning,  mis teeb neid unikaalseks', answers: [{ id: 1, answerText: 'neil on kombeks n-ö visiitabielu, naine otsustab, millise mehe ta ööseks enda juurde lubab' }, { id: 2, answerText: 'nad ei tunne sõdu, vägistamisi ega mõrvu' }, { id: 3, answerText: 'isad on need, kes kasvatavad lapsi, samas kui naised teevad tööd' }, { id: 4, answerText: 'kummalgi partneril pole abikaasa kohustusi, kuid nad jagavad majapidamist ja lapsi' }] },
  { id: 4, questionText: 'Mis on meeste suurim kohustus mosuode hõmus?', answers: [{ id: 1, answerText: 'toetada naisi majanduslikult' }, { id: 2, answerText: 'hoolitseda laste eest' }, { id: 3, answerText: 'oma öistel "visiitidel" edukalt hakkama saamine' }, { id: 4, answerText: 'pere valitsemine' }] },
  { id: 5, questionText: 'Millel põhinevad muoso hõimu inimeste vahelised suhted?', answers: [{ id: 1, answerText: 'armastusel' }, { id: 2, answerText: 'poliitikal' }, { id: 3, answerText: 'majanduslikul heaolul' }, { id: 4, answerText: 'sotsiaalsel survel' }] },
];
*/

store.dispatch(setActiveLanguage('ee'));
store.dispatch(actionCreators.selectText(9));
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
  .add('Container', () => <TextExercisePreparationContainer type="wordGroup" onProceed={action('clicked')} />);

storiesOf('Text selection', module)
  .add('Container', () => <TextSelectionContainer open />);

storiesOf('Text preview', module)
  .add('Container', () => <TextPreviewContainer />);

storiesOf('Text exercise', module)
  .add('Container', () => (
    <TextExercise
      type="readingTest"
      timerState={{
        started: false,
        paused: false,
        stopped: false,
      }}
    />
  ));

storiesOf('Text exercise results', module)
  .add('Container', () => <TextExerciseResultsContainer open />)
  .add('Component', () => (
    <TextExerciseResults
      open
      translate={translate}
      result={{
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
      result={{
        elapsedTime: 124200,
        total: 7,
        correct: 4,
        incorrect: 2,
        unanswered: 1,
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
